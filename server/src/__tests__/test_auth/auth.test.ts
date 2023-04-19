import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import requests from "supertest";
import app from "../../app";
import getSignUpData from "./getSignUpData";
import { MongoMemoryServer } from "mongodb-memory-server";


const signUpData = getSignUpData();
beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
})

describe("auth", () => {

  describe("sign-up", () => {
    describe("given all correct sign-up data", () => {
      it("returns 201 and created user", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

        expect(statusCode).toBe(201);
      })
    })
  })
})
