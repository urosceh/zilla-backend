import test, {describe} from "node:test";
import {JwtGenerator} from "./jwt.generator";

describe("JWT Generator", () => {
  test("should generate a token", () => {
    const token = JwtGenerator.generateForgottenPasswordToken("mika@gmail.com", "4b7a68c31882670ea4fdd6ee608295be237c35e6");
    console.log(token);
  });
});
