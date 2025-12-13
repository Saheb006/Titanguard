import { Router } from "express";
import { analyzeCookieConsent } from "../controllers/cookieConsent.controller.js";
import { analyzePrivacyPolicy } from "../controllers/privacyPolicy.controller.js";
import { analyzeReputation } from "../controllers/reputation.controller.js";
import { detectTrackers } from "../controllers/trackerDetect.controller.js";
import { notificationGuard } from "../controllers/notificationGuard.controller.js";

const router = Router();

// POST /api/v1/analyze/cookieanalyze
router.post("/cookieanalyze", analyzeCookieConsent);  // http://localhost:8000/api/v1/cookieanalyze

router.post("/privacyanalyze", analyzePrivacyPolicy);  // http://localhost:8000/api/v1/privacyanalyze

router.post("/reputationanalyze", analyzeReputation); //http://localhost:8000/api/v1/reputationanalyze

router.post("/trackerdetect", detectTrackers);  // http://localhost:8000/api/v1/trackerdetect

router.post("/notification-guard", notificationGuard);


export default router;
