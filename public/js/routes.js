document.addEventListener('DOMContentLoaded', () => {
    fetchRoutes();
});

const DEFAULT_ROUTE_IMAGE = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80';

async function fetchRoutes() {
    const grid = document.getElementById('routesGrid');
    
    try {
        const [routesRes, imagesRes] = await Promise.all([
            fetch('/api/routes'),
            fetch('/api/images?type=route').catch(() => null)
        ]);

        if (!routesRes.ok) {
            throw new Error(`HTTP error! status: ${routesRes.status}`);
        }
        
        const routes = await routesRes.json();
        const routeImages = imagesRes && imagesRes.ok ? await imagesRes.json() : [];
        
        if (!routes || routes.length === 0) {
            grid.innerHTML = '<p>No routes found in Oracle database.</p>';
            return;
        }

        renderRoutes(grid, routes, routeImages);

    } catch (error) {
        console.error('Failed to fetch routes from Oracle:', error);
        grid.innerHTML = '<p style="color:var(--error-color);">Error loading routes. Please check backend connection.</p>';
    }
}

function renderRoutes(gridElement, routesList, routeImages = []) {
    gridElement.innerHTML = '';
    
    // Find admin default route image (resourceId === 0 or caption containing 'default')
    const adminDefaultImg = routeImages.find(img => 
        (img.resourceType === 'route' || !img.resourceType) && 
        (Number(img.resourceId) === 0 || (img.caption && img.caption.toLowerCase().includes('default')))
    );
    const defaultRouteUrl = adminDefaultImg?.imageUrl || DEFAULT_ROUTE_IMAGE;

    routesList.forEach(route => {
        const card = document.createElement('div');
        card.className = 'glass-panel route-card';
        card.style.padding = '2rem';
        card.style.overflow = 'hidden';
        
        const routeName = route.STARTLOCATION ? `${route.STARTLOCATION} to ${route.ENDLOCATION}` : 'Unknown Route';
        const routeId = route.ROUTEID || route.routeId || 'N/A';
        const isPopular = route.ISPOPULAR === 'Y';
        const status = isPopular ? '★ Popular' : 'Active';
        const distance = route.DISTANCEKM ? `${route.DISTANCEKM} Km` : 'N/A';
        const duration = route.ESTIMATEDDURATION ? `${route.ESTIMATEDDURATION} hrs` : '';
        
        // Find matching image from admin panel or fallback to default
        let imgUrl = defaultRouteUrl;
        const matchedImg = routeImages.find(img => 
            (img.resourceType === 'route' || !img.resourceType) &&
            (Number(img.resourceId) === Number(routeId) || String(img.resourceId) === String(routeId) ||
             Number(img.referenceId) === Number(routeId) || String(img.referenceId) === String(routeId))
        );
        if (matchedImg && matchedImg.imageUrl) {
            imgUrl = matchedImg.imageUrl;
        }
        if (imgUrl && imgUrl.startsWith('data:image')) {
            imgUrl = imgUrl.replace(/[\r\n\s]+/g, '');
        }

        card.innerHTML = `
            <div style="height: 170px; margin: -2rem -2rem 1.5rem -2rem; overflow: hidden; position: relative;">
                <img src="${imgUrl}" alt="${routeName}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='${DEFAULT_ROUTE_IMAGE}'">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <h3 style="font-size: 1.25rem;">${routeName}</h3>
                <span style="background: ${isPopular ? '#e0f2fe' : '#f1f5f9'}; color: ${isPopular ? '#0284c7' : '#475569'}; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600;">
                    ${status}
                </span>
            </div>
            <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">Route ID: <strong>#${routeId}</strong></p>
            <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-secondary);">Distance: ${distance} ${duration ? '&bull; ' + duration : ''}</p>
            <div>
                <a href="book.html?routeId=${routeId}" class="btn-primary" style="text-decoration: none; display: inline-block;">Book This Route</a>
            </div>
        `;
        
        gridElement.appendChild(card);
    });
}
