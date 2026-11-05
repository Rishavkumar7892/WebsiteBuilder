import express from "express"
import isAuth from "../middleware/isAuth.js"
import { billing } from "../controllers/biling.controller.js"

const billingRouter = express.Router()

billingRouter.post("/", isAuth, billing)

export default billingRouter