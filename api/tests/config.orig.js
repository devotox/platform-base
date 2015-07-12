"use strict";

// Configuration

// This file will hold secret values and
// specific config values specific to user and environment

(function(){

	var config = {
		web: {
			port: "",
			scheme: "https://",
			api_prefix: "api/",
			host: "www.doctify.local.com/"
		},
		auth: {
			intranet: {
				password: "testspecialist123",
				email: "test-specialist@test.com"
			},
			specialist: {
				password: "testspecialist123",
				email: "test-specialist@test.com"
			},
			patient: {
				password: "testpatient123",
				email: "test-patient@test.com"
			}
		},
		patient: {
			uri_id: "test_patient_1",
			id: "8defa6e2-e402-492b-a67e-a0d9703da11d"
		},
		specialist: {
			uri_id: "dr_test_specialist",
			id: "56aef7c2-e186-4d6a-a1dd-1f73a33cd5a1"
		},
		practice: {
			uri_id: "test_practice",
			id: "7ad8122e-b1b2-4671-9c9d-e14676e200d7"
		},
		mailing_list: {
			email: "test@test.com"
		}
	};

	config.practice.update_data = {
		"id": "7ad8122e-b1b2-4671-9c9d-e14676e200d7",
		"uri_id": "test_practice",
		"name": "Test Practice",
		"unit_name": "Test Unit",
		"email": "test@test.com",
		"phone": "0123456789",
		"is_nhs": true,
		"address": {
			"postcode": "E20 1BP",
			"street1": "34 Chroma Mansions",
			"street2": "14 Penny Brookes Street",
			"city": "London",
			"county": null,
			"country": null,
			"geolocation": "{\"type\":\"Point\",\"coordinates\":[-0.0049025,51.5463231]}",
			"google_place_id": "ChIJVei1TWMddkgRmqzmOO2k3k8"
		},
		"insurers": [{
			"id": 12,
			"name": "health-on-line",
			"website": "https://www.health-on-line.co.uk"
		}],
		"average_review": null,
		"number_of_reviews": 0,
		"attributes": null,
		"status": "approved",
		"isVisible": true
	};

	config.patient.update_data = {
		"id": "8defa6e2-e402-492b-a67e-a0d9703da11d",
		"uri_id": "test_patient_1",
		"firstname": "test",
		"lastname": "patient",
		"attributes": {
			"address": {
				"postcode": null,
				"city": null,
				"couny": null,
				"country": null,
				"geolocation": {
					"type": null,
					"cordinates": [
						null
					]
				}
			},
			"birthdate": "10-aug-1965",
			"gender": "m",
			"phone": null
		}
	};

	config.specialist.update_data = {
		"id": "56aef7c2-e186-4d6a-a1dd-1f73a33cd5a1",
		"uri_id": "dr_test_specialist",
		"title": "dr",
		"firstname": "test",
		"lastname": "specialist",
		"suffix": null,
		"gender": "m",
		"specialty": 1,
		"profile_image": null,
		"average_review": null,
		"number_of_reviews": 0,
		"languages": [],
		"insurers": null,
		"attributes": {
			"about": null,
			"education": null,
			"special_interests": null
		},
		"phone": "0123456789",
		"status": "approved",
		"type": "specialist",
		"practices": [
			config.practice.update_data
		]
	}

	if(typeof window === "undefined") {
		module.exports = config;
	} else { window.config = config; }

})();
