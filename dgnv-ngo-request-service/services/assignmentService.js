const axios = require("axios");

async function findVolunteer(request, ngoId) {
    const response = await axios.get(
        "http://localhost:9202/api/volunteers/available",
        { params: { ngo_id: ngoId } }
    );

    const volunteers = Array.isArray(response.data) ? response.data : [];

    // Keep the existing location-priority logic exactly:
    // GS Division -> DS Division -> District.
    let volunteer = volunteers.find(v =>
        v.gs_division && request.gs_division &&
        v.gs_division === request.gs_division
    );

    if (volunteer) return volunteer;

    volunteer = volunteers.find(v =>
        v.ds_division && request.ds_division &&
        v.ds_division === request.ds_division
    );

    if (volunteer) return volunteer;

    volunteer = volunteers.find(v =>
        v.district && request.district &&
        v.district === request.district
    );

    return volunteer || null;
}

module.exports = { findVolunteer };
