import requests from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import { getRandomProfilePath } from "../utils/pathsGenerators";
import app from "../index";


beforeEach(async () => {
  await User.deleteMany({});
});

const signUpData = {
  firstName: "john",
  lastName: "doe",
  email: "johndoe@gmail.com",
  password: "1234567890"
};

const userDataForModel = {
  ...signUpData,
  profilePath: getRandomProfilePath()
}

describe("auth", () => {
  describe("sing-up", () => {
    describe("given all correct sign-up data", () => {
      it("returns created user and token", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

          assertJson(headers);
          expect(statusCode).toBe(201);
          expect(body.user).toBeDefined();
          expect(body.token).toBeDefined();
      })
    })

    describe("given user with this email already exists", () => {
      it("returns a duplicate error", async () => {
        await User.create(userDataForModel);

        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

        assertJson(headers);
        expect(body.message).toBeDefined();
        expect(statusCode).toBe(409);
      })
    })

    givenSignUpDataIsMissing("firstName");
    givenSignUpDataIsMissing("lastName");

    describe("give the password is missing", () => {
      it("returns password missing error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send({ ...signUpData, password: undefined });
        
        assertJson(headers);
        expect(body.message).toMatch(/password is required/i);
        expect(statusCode).toBe(400);
      })
    })
  })
})


function givenSignUpDataIsMissing(missingData: string) {
  describe(`given the ${missingData} is missing`, () => {
    it("returns 400 error", async () => {
      const { body, statusCode, headers } = await requests(app)
        .post("/auth/sign-up")
        .send({ ...signUpData, [missingData]: undefined });

      const regexMatch = `Path \`${missingData}\` is required`;
      const regex = new RegExp(regexMatch);

      expect(body.message).toMatch(regex);
      assertJson(headers);
      expect(statusCode).toBe(400);
      expect(body.message).toBeDefined();
    })
  })
}

function assertJson(headers: any) {
  expect(headers["content-type"]).toMatch(/json/);
}