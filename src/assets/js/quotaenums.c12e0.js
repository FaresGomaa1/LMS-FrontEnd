(window.webpackJsonp=window.webpackJsonp||[]).push([[338],{"x+u3":function(t,e,o){"use strict";o.r(e);var a=o("lSNA"),i=o.n(a),n=o("mSNy");function r(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,a)}return o}function u(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?r(Object(o),!0).forEach((function(e){i()(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var p={removeBranding:{title:n.default.t("popups.removeBrandingPopup.title"),text:n.default.t("popups.removeBrandingPopup.text"),icon:"tags",resourceType:"removeBranding",upgradeOptions:[0,0,0]},formCount:{title:n.default.t("popups.formCreateQuotaPopup.login.title"),text:n.default.t("popups.formCreateQuotaPopup.login.text"),icon:"rocket",resourceType:"formCount",upgradeOptions:[25,0,0]},notificationEmailCount:{title:n.default.t("formSettings.notificationSettings.upgradePackage"),text:n.default.t("formSettings.notificationSettings.howManyMailToAdd"),icon:"envelopes-bulk",quotaLabel:n.default.t("formSettings.notificationSettings.email"),resourceType:"notificationEmailCount",upgradeOptions:[3,5,10]},sendEmailNotificationCount:{title:n.default.t("popups.emailNotificationQuotaPopup.title"),text:n.default.t("popups.emailNotificationQuotaPopup.text"),icon:"envelope",resourceType:"sendEmailNotificationCount",upgradeOptions:[0,0,0]},domain:{title:n.default.t("formSettings.notificationSettings.upgradePackage"),icon:"rocket",resourceType:"domain"},fileSpace:{title:n.default.t("formSettings.notificationSettings.upgradePackage"),text:n.default.t("popups.formCreateQuotaPopup.file.title"),icon:"database",resourceType:"fileSpace",upgradeOptions:[{text:"10 GB",quota:1024e4},{text:"100 GB",quota:1024e5},{text:"1 TB",quota:1024e6}]},teamMemberCount:{title:n.default.t("formSettings.notificationSettings.upgradePackage"),text:n.default.t("howManyMembersWantAdd"),icon:"users",resourceType:"teamMemberCount",upgradeOptions:[{text:n.default.t("teamMember.quotaMember",{quota:1}),quota:1},{text:n.default.t("teamMember.quotaMembers",{quota:4}),quota:4},{text:n.default.t("teamMember.quotaMembers",{quota:9}),quota:9}]}};e.default={removeBranding:p.removeBranding,emailBrandingLogo:u(u({},p.removeBranding),{},{title:n.default.t("formSettings.notificationSettings.upgradePackage"),text:n.default.t("formSettings.notificationSettings.brandingLogoUpgradeText"),icon:"image"}),formCreate:p.formCount,notificationEmailCount:p.notificationEmailCount,thankYouPageRedirect:u(u({},p.removeBranding),{},{title:n.default.t("popups.redirectAfterSubmitPopup.title"),text:n.default.t("popups.redirectAfterSubmitPopup.text"),icon:"arrow-alt-from-left",eventName:"thankYouPage-redirect"}),removeThankYouPage:u(u({},p.removeBranding),{},{title:n.default.t("popups.removeThankYouPagePopup.title"),text:n.default.t("popups.removeThankYouPagePopup.text"),icon:"arrow-alt-from-left",eventName:"thankYouPage-show"}),fileSpace:p.fileSpace,sendEmailNotificationCount:p.sendEmailNotificationCount,teamMemberCount:p.teamMemberCount,domain:p.domain}}}]);