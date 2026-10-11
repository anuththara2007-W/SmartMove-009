document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('bookingForm');

    form.addEventListener('submit', handleBookingSubmit);



    loadVehiclesForSelection();



    prefillRouteFromQuery();



    // Initial check to enable/disable submit button

    validateForm();
});



async function prefillRouteFromQuery() {

    const params = new URLSearchParams(window\.location.search);

    const routeId = params.get('routeId');

    if (!routeId) return;



    try {

        const res = await fetch('/api/routes');

        if (!res.ok) return;

        const routes = await res.json();

        const found = routes.find(r => (r.ROUTEID || r.routeId) == routeId);

        if (found) {

            const startInput = document.getElementById('startLocation');

            const endInput = document.getElementById('endLocation');

            if (startInput && found.STARTLOCATION) startInput.value = found.STARTLOCATION;

            if (endInput && found.ENDLOCATION) endInput.value = found.ENDLOCATION;

            validateForm();

        }

    } catch (err) {

        console.error('Error prefilling route:', err);

    }

}