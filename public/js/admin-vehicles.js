document.addEventListener('DOMContentLoaded', () => {
    if (!SmartMoveUtils.setupAdminAuth()) return;

    let editingVehicleId = null;

    fetchFleetData();

    const form = document.getElementById('addVehicleForm');
    if (form) {
        form.addEventListener('submit', handleAddOrUpdateVehicle);
    }
});

async function handleAddOrUpdateVehicle(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    
    const registrationNumber = document.getElementById('vehRegNum').value;
    const model = document.getElementById('vehModel').value;
    const capacity = document.getElementById('vehCapacity').value;
    const imageUrl = document.getElementById('vehImageUrl').value;
    
    if (!registrationNumber || !model || !capacity) return;
    
    try {
        btn.disabled = true;
        btn.textContent = window.editingVehicleId ? 'Updating...' : 'Adding...';
        
        const payload = { registrationNumber, model, capacity: parseInt(capacity), status: 'Active' };
        let vehicleId = window.editingVehicleId;

        if (window.editingVehicleId) {
            // Update in Oracle
            const oracleRes = await fetch(`/api/vehicles/${window.editingVehicleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!oracleRes.ok) throw new Error('Failed to update vehicle in Oracle');
            SmartMoveUtils.showToast(`Vehicle #${vehicleId} updated successfully!`, 'success');
        } else {
            // Create in Oracle
            const oracleRes = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!oracleRes.ok) throw new Error('Failed to create vehicle in Oracle');
            const oracleData = await oracleRes.json();
            vehicleId = oracleData.vehicleId;
            SmartMoveUtils.showToast(`Vehicle #${vehicleId} added successfully!`, 'success');
        }
        
        // Add Document to MongoDB (always upserts if we pass vehicleID)
        if (imageUrl) {
            await fetch('/api/vehicles/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vehicleID: vehicleId, imageUrl })
            });
        }
        
        e.target.reset();
        window.editingVehicleId = null;
        btn.textContent = 'Add Vehicle';
        fetchFleetData();
        
    } catch (error) {
        console.error('Add Vehicle Error:', error);
        SmartMoveUtils.showToast(error.message || 'Failed to add vehicle', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Add Vehicle';
    }
}

async function fetchFleetData() {
    const grid = document.getElementById('fleetGrid');
    
    try {
        const [vehiclesRes, docsRes] = await Promise.all([
            fetch('/api/vehicles'),
            fetch('/api/vehicles/documents')
        ]);
        
        if (!vehiclesRes.ok) throw new Error('Failed to fetch Oracle vehicles');
        
        const vehicles = await vehiclesRes.json();
        let docs = [];
        if (docsRes.ok) docs = await docsRes.json();
        
        if (!vehicles || vehicles.length === 0) {
            SmartMoveUtils.renderEmptyState(grid, 'No Fleet Data', 'Database is empty.');
            return;
        }

        renderFleet(grid, vehicles, docs);

    } catch (error) {
        console.error('Admin Error:', error);
        SmartMoveUtils.renderErrorState(grid, 'Failed to fetch vehicles.');
    }
}

function renderFleet(gridElement, vehiclesList, docsList) {
    gridElement.innerHTML = '';
    
    vehiclesList.forEach(v => {
        const id = Array.isArray(v) ? v[0] : (v.VEHICLEID || v.vehicleId);
        const reg = Array.isArray(v) ? v[1] : (v.REGNUMBER || v.regNumber);
        const type = Array.isArray(v) ? v[2] : (v.VEHICLETYPE || v.vehicleType);
        const capacity = Array.isArray(v) ? v[3] : (v.CAPACITY || v.capacity);
        const status = Array.isArray(v) ? v[4] : (v.STATUS || v.status);

        const card = document.createElement('div');
        card.className = 'fleet-card';
        card.style.position = 'relative';
        
        const matchedDoc = docsList.find(doc => doc.vehicleID == id);
        let imageUrl = (matchedDoc && matchedDoc.imageUrls && matchedDoc.imageUrls.length > 0) ? matchedDoc.imageUrls[0] : '';
        if (imageUrl.startsWith('data:image')) { imageUrl = imageUrl.replace(/[\r\n\s]+/g, ''); }
        
        const imgHtml = imageUrl ? `<img src="${imageUrl}" alt="Vehicle ${id}" class="fleet-img" onerror="this.style.display='none'">` : `<div style="height: 150px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8;">No Image</div>`;
        const docsCount = matchedDoc && matchedDoc.pdfDocumentPaths ? matchedDoc.pdfDocumentPaths.length : 0;
        
        card.innerHTML = `
            ${imgHtml}
            <div class="fleet-info">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; color: #0f172a;">Vehicle #${id}</h3>
                    <span style="background: ${status === 'Active' ? '#ecfdf5' : '#fffbeb'}; color: ${status === 'Active' ? '#059669' : '#d97706'}; border: 1px solid ${status === 'Active' ? '#a7f3d0' : '#fde68a'}; padding: 3px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">
                        ${status}
                    </span>
                </div>
                <p style="margin-bottom: 0.35rem; font-size: 0.9rem; color: #334155;">
                    <strong>Reg:</strong> ${reg} &nbsp;&bull;&nbsp; <strong>Type:</strong> ${type}
                </p>
                <p style="margin-bottom: 1.25rem; font-size: 0.9rem; color: #64748b;">
                    <strong>Capacity:</strong> ${capacity || 'N/A'} Seats
                </p>
                <div style="display: flex; gap: 0.75rem;">
                    <button class="action-btn-edit edit-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                    </button>
                    <button class="action-btn-delete delete-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Delete
                    </button>
                </div>
            </div>
        `;
        
        card.querySelector('.edit-btn').addEventListener('click', () => {
            window.editingVehicleId = id;
            document.getElementById('vehRegNum').value = reg;
            document.getElementById('vehModel').value = type;
            document.getElementById('vehCapacity').value = capacity;
            document.getElementById('vehImageUrl').value = imageUrl;
            
            const btn = document.getElementById('addVehicleForm').querySelector('button[type="submit"]');
            btn.textContent = 'Update Vehicle';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        card.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm(`Are you sure you want to delete Vehicle #${id}?`)) {
                try {
                    const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error || 'Failed to delete');
                    }
                    SmartMoveUtils.showToast(`Vehicle #${id} deleted!`, 'success');
                    fetchFleetData();
                } catch(e) {
                    SmartMoveUtils.showToast(e.message, 'error');
                }
            }
        });

        gridElement.appendChild(card);
    });
}
