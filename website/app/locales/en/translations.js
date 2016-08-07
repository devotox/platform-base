import ENV from '../../config/environment';

export default {

	"assets": ENV.i18n.assets,

// ---------------- Change only below this line ------------ //
	"components": {
		"locale-select": {
			"locale": {
				"de": "German",
				"en": "English",
				"es": "Spanish",
				"fr": "French",
				"hi": "Hindi",
				"it": "Italian",
				"ja": "Japanese",
				"nl": "Dutch",
				"pt": "Portugese",
				"ru": "Russian",
			}
		},
		"video-module": {
			"list": {
				"header": "Video List",
				"no-videos-available": "Sorry No videos Available"
			}
		},
		"chat-module": {
			"title": "Platform Chat",
			"message-input": {
				"label": "Enter Message"
			},
			"username-input": {
				"label": "Username"
			},
			"send-button": {
				"text": "Send"
			}
		},
		"forms": {
			"reset-form": {
				"title": "Account Reset",
				"inputs": {
					"email": {
						"label": "Email Address"
					},
					"password": {
						"label": "New Password"
					}
				},
				"links": {
					"sign-up": {
						"text": {
							"one": "Don't Have An Account?",
							"two": "Sign Up Today"
						},
					}
				},
				"buttons": {
					"reset": {
						"text": "Reset"
					}
				}
			},
			"login-form": {
				"title": "Account Login",
				"inputs": {
					"username": {
						"label": "Username / Email Address"
					},
					"password": {
						"label": "Password"
					}
				},
				"links": {
					"forgot-password": {
						"text": "Forgot Password?"
					},
					"sign-up": {
						"text": {
							"one": "Don't Have An Account?",
							"two": "Sign Up Today"
						},
					}
				},
				"buttons": {
					"login": {
						"text": "Log In"
					}
				}
			},
			"sign-up-form": {
				"title": "Account Registration",
				"inputs": {
					"email": {
						"label": "Email Address"
					},
					"username": {
						"label": "Username"
					},
					"password": {
						"label": "Password"
					},
					"firstname": {
						"label": "First Name"
					},
					"lastname": {
						"label": "Last Name"
					},
					"birthdate": {
						"label": "Date Of Birth"
					},
					"phone": {
						"label": "Phone"
					},
					"gender": {
						"label": "Gender",
						"options": {
							"male": "Male",
							"female": "Female"
						}
					}
				},
				"links": {
					"login": {
						"text": {
							"one": "Already Have An Account?",
							"two": "Sign In Now"
						},
					}
				},
				"buttons": {
					"sign-up": {
						"text": "Sign Up"
					}
				}

			}
		}
	},

	"global": {
		"title": "Platform Base",
		"company": "Detox Inc.",
		"contact": "devo.tox.89@gmail.com",
		"description": "Jump Start Your Platform Today"
	},
	"banner": {
		"header": {
			"text": "Platform Base"
		},
		"subheader": {
			"text": {
				"one": "An architecture both modular & configurable to jump start your platform",
				"two": "Fork and modify as you see fit in your case"
			}
		},
		"video": {
			"title": "Brand Video"
		},
		"button": {
			"text": "Sign Up"
		}
	},
	"navigation": {
		"brand": {
			"logo": {
				"light": {
					"alt": "Brand Logo Light"
				},
				"dark": {
					"alt": "Brand Logo Dark"
				}
			}
		},
		"links": {
			"home": {
				"text": "Home"
			},
			"chat": {
				"text": "Chat"
			},
			"videos": {
				"text": "Videos"
			},
			"search": {
				"text": "Search"
			},
			"account": {
				"text": "Account"
			},
			"profile": {
				"text": "Profile"
			},
			"logout": {
				"text": "Logout"
			},
			"login": {
				"text": "Login"
			}
		}
	},
	"social-media-links": {
		"github": {
			"title": "Devonte's Github Account"
		},
		"googleplus": {
			"title": "Devonte's Google Plus Posts"
		},
		"twitter": {
			"title": ""
		},
		"linkedin": {
			"title": ""
		},
		"facebook": {
			"title": ""
		},
		"instagram": {
			"title": "Devonte's Instagram Posts"
		},
		"wordpress": {
			"title": ""
		}
	},
	"footer": {
		"the-company": {
			"header": {
				"text": "The Company"
			},
			"about": {
				"text": "About"
			},
			"careers": {
				"text": "Careers"
			},
			"mission": {
				"text": "Our Mission"
			}
		},
		"contact-us": {
			"header": {
				"text": "Contact Us"
			},
			"social": {
				"text": "Social"
			},
			"press": {
				"text": "Press"
			},
			"contact": {
				"text": "Contact"
			}
		},
		"legal": {
			"header": {
				"text": "Legal"
			},
			"privacy-policy": {
				"text": "Privacy Policy"
			},
			"trust-and-safety": {
				"text": "Trust & Safety"
			},
			"terms-and-conditions": {
				"text": "Terms & Conditions"
			}
		},
		"development": {
			"header": {
				"text": "Development"
			},
			"tests": {
				"text": "Tests"
			},
			"readme": {
				"text": "Readme"
			},
			"licenses": {
				"text": "Licenses"
			}
		}
	},
	"footer-copyright": {
		"phone": {
			"text": "( +44 ) 0123 456 789"
		},
		"email": {
			"text": "hello@devotox.com"
		},
		"company": {
			"text": "&copy; 2015 Detox Inc. All Rights Reserved."
		},
		"contact-us": {
			"text": "Contact us"
		}
	},

	// ---------------- Full Pages - Use page name ------------ //
	"pages": {
		"search": {
			"label": {
				"text": "Search"
			},
			"show-search-term": {
				"text": "Search: "
			}
		},
		"terms-and-conditions": {
			"title": {
				"text": "Terms of Use"
			}
		},
		"trust-and-safety": {
			"title": {
				"text": "Our Trust &amp; Safety Oath"
			}
		},
		"privacy-policy": {
			"title": {
				"text": "Privacy Policy"
			}
		},
		"logout": {
			"authenticated": {
				"text": "Logging Out...."
			},
			"unauthenticated": {
				"text": "You are logged out..."
			}
		},
		"reset-success": {
			"title": {
				"text": "Success!"
			},
			"body": {
				"text": {
					"one": "Your password should now be reset.",
					"two": "Please check your emails for a reset link.",
					"three": ""
				}
			}
		},
		"sign-up-success": {
			"title": {
				"text": "Success!"
			},
			"body": {
				"text": {
					"one": "Thanks for signing up",
					"two": "There is just one more step.",
					"three": "Please check your emails for an activation link."
				}
			}
		},
		"contact-us": {
			"title": {
				"text": "Contact Us"
			},
			"preamble": {
				"text": "All of us here appreciate that there is nothing more important than your continuous support – so we will always prioritise it. Please contact us whenever you need anything, we will do our best to be there for you."
			},
			"contact-details": {
				"body": {
					"phone": {
						"text": {
							"pre": "Call us at",
							"number": "+44 0123 456 789"
						}
					},
					"email": {
						"text": {
							"pre": "Email us at",
							"address": "DnD email"
						}
					},
					"social": {
						"text": {
							"pre": "Raise a support request at",
							"address": "Platform Base issues"
						}
					}
				}
			}
		},
		"press": {
			"title": {
				"text": "Press"
			},
			"preamble": {
				"text": "Are you a member of the press and would like to write or report about the Platform please reach out – and contact us for more information at press@dnd-ent.co.uk or +44 0123 45678"
			},
			"newsfeed": {
				"header": {
					"text": "Newsfeed"
				},
				"body": {
					"text": "No news at the moment."
				}
			}
		},
		"mission": {
			"title": {
				"text": "The Platform Mission"
			},
			"preamble": {
				"text": ""
			},
			"our-story": {
				"header": {
					"text": "Our Story"
				},
				"body": {
					"text": "The idea for a platform base started when our founder, Devonte, decided that he wanted to give the world the best all around platform to begin any application suite. Having seen a lot of different ways platforms are architectured, he felt this would be the most versatile, resilient, and future proof way to build single page applications."
				}
			},
			"our-mission": {
				"header": {
					"text": "Our Mission"
				},
				"body": {
					"text": "Rooted in our experience and understanding of both the personal and professional sides of programming, we are driven by a passionate belief that you should not be hindered by the tedious needs of the peripherals of creating a platform. We are working on making our Developers’ lives easier and giving you the chance to just focus on the most important parts of your code. We are striving to continuously improve what we believe could be very useful to all and take inspiration from a lot of sources and input them into this base."
				}
			},
			"our-solution": {
				"header": {
					"text": "Our Solution"
				},
				"body": {
					"text": "You are looking at it! This site was built using the platform base we laid out."
				}
			}
		},
		"careers": {
			"title": {
				"text": "Careers"
			},
			"preamble": {
				"text": "We are hiring! Want to join a team that's improving development platforms in the UK? Browse through the below open roles and drop us a line if you are interested"
			},
			"why-join": {
				"header": {
					"text": "Why Join Our Team?"
				},
				"body": {
					"text": "In our offices in central London we are changing the way people look at platform development every day. Our strategy: Combine smart people, great performance, and outcome driven strategy – and don’t forget about the fun at work!"
				}
			},
			"job-openings": {
				"header": {
					"text": "Openings"
				},
				"body": {
					"text": "Coming Soon."
				}
			}
		},
		"devonte": {
			"title": {
				"text": "Who Am I?"
			},
			"preamble": {
				"text": "Find Out!"
			},
			"tagline": {
				"header": {
				"text": "My Mantra"
				},
				"body": {
					"text": "“Perfection is finally attained not when there is no longer anything to add, but when there is no longer anything to take away.” ~ Antoine de Saint Exupéry "
				}
			},
			"contact-card": {
				"name": {
					"label": "Name",
					"text": "Devonte"
				},
				"job-title": {
					"label": "Job Title",
					"text": "Software Engineer"
					
				},
				"email": {
					"label": "Email",
					"text": "devo.tox.89@gmail.com"

				},
				"phone": {
					"label": "Phone",
					"text": "(+44) 7447 903 346"
				}
			},
			"external-contact-card": {
				"github": {
					"text": "Github"
				},
				"stack-overflow": {
					"text": "Stack Overflow Profile"
				},
				"key-project": {
					"text": "Platform Base Progression"
				}
			},
			"introduction": {
				"header": {
					"text": "Introduction"
				},
				"body": {
					"text": {
						"one": "Simple, Fast, Efficient",
						"two": "I believe programming to be much more than just a way to make a computer do a task. The act of programming in itself is an art, a functional art, but an art nonetheless. As programmers we are meant to find a solution that is easy to adapt, modify, and reuse and it should never be about making something \"just work\".",
						"three": "Code is read more than written and what we write should not be black boxed. Every line should be elegant and easy to read for anyone viewing the code, be it days, weeks or even years from now. Before starting to write any code we should first attain to understand the task at hand and then furthermore break this task down into sub tasks.",
						"four": "We must strive to understand a problem well enough that it can be explained to a machine simply enough, knowing that there must be clarity in even the most elegant of solutions. And in this sense I am an artist, Sublime Text 3 is my canvas, Javascript is my paint, and each line of code I write is a testament to my artistic integrity."
					}
				}
			},
			"about-me": {
				"header": {
					"text": "In Case All That Wasn't Enough..."
				},
				"body": {
					"text": {
						"one": "I am a highly motivated and driven Developer with excellent skills acquired through various roles in employment and education.",
						"two": "I will be a useful asset to your establishment by providing the fastest, most efficient, and scalable solutions to a wide range of tasks.",
						"three": "I pride myself in being a fast learner who works hard to achieve and surpass set goals. Responsible and conscientious with a friendly but competitive streak, I aim to do my absolute best in everything.",
						"four": "I have developed a good reputation for my leadership and organisational skills and work well as part of a team. My problem solving, communication, and interpersonal skills have allowed me to show my potential and step up to a managerial role in which I have been in charge of projects and product building. I've led a team that doubled in size extremely quickly after showing I was capable of managing a group of people very effectively all while also finding time to work on my own personal projects."
					}
				}
			},
			"personal-projects": {
				"header": {
					"text": "Personal Projects",
					"loading": "In Progress..."
				},
				"body": {
					"text": {
						"one": "Platform Base",

						"two": {
							"objective": "The objective of this project was for any Developer to be able to have a solid start to building a full and simple platform.    Wiring multiple libraries together and making sure to have tests / best practices in place allows a user to skip weeks of framework buildup.",
							"points": {
								"one": "Using Ember JS as the backbone because I believe they are the most full featured and forward thinking of all application frameworks. Their motto - “A framework for creating ambitious web applications” encapsulated how I feel about myself, ambitious!",
								"two": "Gulp JS is the main asset pipeline and the glue combining the multiple applications and technologies together.",
								"three": "Nginx is used as a reverse proxy / frontend server for static assets / a sort of minimal load balancer for all requests to the Node JS API Server",
								"four": "Node JS handles all/only api requests as that is where it excels.",
								"five": "This framework also boasts international language support baked into the core and a build / test / deploy pipeline which can shave off even more weeks of work for a Developer."
							}
						},

						"three": "Raspberry PI Setup - Not on Github yet",

						"four": {
							"objective": "I love the Raspberry PI and its aspiration to put computing into everyone’s hands. I got myself both the old version and the new to make sure the scripts written worked on both. My aim was to make it seamless to use Raspberry PI by using a set of shell scripts (minimally interactive in places were passwords/paths are needed) to set up one's system in ways I believe are extremely important for a Developer – i.e. security; build tools; environment setup.",
							"points": {
								"one": "It starts by inserting the SD card into the mac and running a simple setup.sh file which will prompt you to type your username and allow you to download the minimal raspbian (non GUI) image. ",
								"two": "The OS image and your new user along with your own personal SSH ID from ID_RSA will be transferred and written to the Raspberry PI SD card.",
								"three": "Upon plugging it to the Raspberry PI it will continue to set up your new user which would be the same as the one you were prompted for and carry on setting up things like the apt sources, fish shell, a static ip, an openvpn server, web server, no-ip ddns updater.",
								"four": "Multiple security layers are then set in place to give as secure a system as possible i.e. never allowing root to ssh login, passwordless login for the new user created, ufw, fail2ban, iptables, watchdog, and port knocking.",
								"five": "Once the project is finished, it will be easy to pick and choose the high level packages you want on your Raspberry pi system, all from a command line GUI like the raspi-config"
							}
						},
					}
				}
			},
			"job-specific": {
				"header": {
					"text": "Why Basecamp You Ask?"
				},
				"body": {
					"text": {
						"one": "Basecamp to me represents the word awesome. When I read your blog at Signal V. Noise, I’m always blown away by how what you say seems like common sense, and yet is not so common. I’m astounded by how quickly you went into remote work and reading your books “Remote” and “Rework” helped me to realize once again that this just makes sense. I am guilty of being one of those passionate people that you talk about who often can’t seem to turn the \"work switch\" off, but I am learning to let myself rest. I love working on solutions that are needed, with people that make sense, in an environment where I know I am appreciated, and where I too can focus on encouraging and appreciating others. We look like a good fit – Why don’t we make it official?",
						"two": "I am an excellent candidate for the Operations or Data projects because of my voracious ability to soak up and distill knowledge to implement relevant solutions. I am a natural perfectionist who seeks nothing but the best in all areas, and I will aim to do the same here. I bring with me algorithms that excel in efficiency, speed, reliability, and would be a great addition to any part of your development process.",
						"three": "I enjoy creating tools that I believe would be useful to everyone, and seeing how they then use these tools to better their workflow or change it in a way that suits them best. I have a strong belief that we must continue growing technologically, and the best way to grow successfully and get better as an individual is to gather all the knowledge possible from people who know more than you do on a subject and then build upon it.",
						"four": "Thank you for taking the time to consider my application, and I look forward to hearing from you!",
					}
				}
			}
		},
		"about": {
			"title": {
				"text": "Welcome to your Platform"
			},
			"preamble": {
				"text": ""
			},
			"tagline": {
				"header": {
					"text": "Tagline"
				},
				"body": {
					"text": "Your all in one platform solution - only the best will do."
				}
			},
			"introduction": {
				"header": {
					"text": "Introduction"
				},
				"body": {
					"text": {
						"one": "We are a small company on the verge of exploding out the gates",
						"two": "As a company we saw the need for another step in the evolution of Developer tools. In the spirit of Ember JS (which is the main backbone of the platform) we use a convention over configuration technique to make sure that you are always using the best solution for you.",
						"three": "We give just a couple of places where you can change up text and assets and be ready to go in minutes. Further configuration is always possible by just tweaking any of the css / js / asset files",
						"four": "The team behind the Platform Base combines experts with in-depth experience in development, design, consultancy, and is backed by investors with a history in identifying and supporting exciting new ventures"
					}
				}
			}
		},
		"social": {
			"title": {
				"text": "Social Media & Blogs"
			},
			"preamble": {
				"text": "Follow us and see many ways to approach problems with best practices in mind. <br/> <br/> We will also have many talks from some of the greatest pioneers in the world of javascript."
			},
			"facebook": {
				"title": {
					"text": "Facebook"
				},
				"link": {
					"text": "We can always do with more friends & fans"
				}
			},
			"twitter": {
				"title": {
					"text": "Twitter"
				},
				"link": {
					"text": "Follow / Retweet us"
				}
			},
			"instagram": {
				"title": {
					"text": "Instagram"
				},
				"link": {
					"text": "View our latest pictures"
				}
			},
			"googleplus": {
				"title": {
					"text": "Google+"
				},
				"link": {
					"text": "Our posts deserve your +1's"
				}
			},
			"linkedin": {
				"title": {
					"text": "LinkedIn"
				},
				"link": {
					"text": "View our professional profile"
				}
			},
			"wordpress": {
				"title": {
					"text": "Wordpress"
				},
				"link": {
					"text": "Our blog can keep you up to date on our newest changes"
				}
			},
			"github": {
				"title": {
					"text": "Github"
				},
				"link": {
					"text": "Follow our Developers"
				}
			}
		},
		"home": {
			"sections": {
				"one": {
					"column-one": {
						"header": "Features",
						"text": "Mobile/Offline Ready <br/> Testing Base <br/> Internalization <br/> Build Tools <br/> AWS Deployment <br/> Common Routes <br/> Common API's"
					},
					"column-two": {
						"header": "Configurable",
						"text": "All text, images, and icons can easily be changed by modifying & extending the translations.js and the assets.js files. <br/> Further customizability comes from the fact that this is just a base and everything is open for you to tinker with and extend."
					},
					"column-three": {
						"header": "Compatible",
						"text": "IE9+ <br/> Chrome / Safari <br/> Firefox / Opera <br/> Android 2.3+ <br/> IOS 5+"
					}
				},
				"two": {
					"column-one": {
						"text": {
							"one": "Extremely Modular",
							"two":  "Uses Only Best Practices",
							"three": "Write Once Use Everywhere Model"
						},
						"image": {
							"alt": "Parallax Image - Section Two"
						}
					}
				},
				"three": {
					"column-one": {
						"header": "Sign up for updates",
						"text": "Enter your email below to be alerted everytime the platform base is updated so you can keep up to date with all new features / bugfixes.",
						"email": {
							"label": "Email Address"
						}
					}
				},
				"four": {
					"text": {
						"one": "Developers Helping Developers",
						"two":  "Powered by EmberJS / Express &copy;",
						"three": "Continuously Updated Using The Best From All",
					},
					"image": {
						"alt": "Parallax Image - Section Four"
					}

				}
			}
		}
	}
};
