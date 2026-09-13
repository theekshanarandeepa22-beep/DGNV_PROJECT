const axios = require("axios");

async function findVolunteer(request) {

    const response = await axios.get(
        "http://localhost:9202/api/volunteers/available"
    );

    const volunteers = response.data;

    // GS Match
    let volunteer = volunteers.find(v =>
        v.gs_division === request.gs_division
    );

    if (volunteer) return volunteer;

    // DS Match
    volunteer = volunteers.find(v =>
        v.ds_division === request.ds_division
    );

    if (volunteer) return volunteer;

    // District Match
    volunteer = volunteers.find(v =>
        v.district === request.district
    );

    return volunteer || null;
}

module.exports = {
    findVolunteer
};