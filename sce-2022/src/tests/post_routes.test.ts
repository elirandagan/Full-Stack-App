import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import Post from "../models/post_model";
import User from "../models/user_model";

const message = "this is my test message";
let sender = "1234567890";
let retId = "";

const email = "test@a.com";
const password = "1234567890";
let accessToken = "";

beforeAll(async () => {
  //clear Posts collection
  await Post.deleteMany({ sender: sender });
  await User.deleteMany({ email: email });
});

afterAll(async () => {
  await Post.deleteMany({ sender: sender });
  await User.deleteMany({ email: email });
  mongoose.connection.close();
});

describe("This is Post API test", () => {
  test("Test register to get access token", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ email: email, password: password });
    expect(response.statusCode).toEqual(200);
    accessToken = response.body.access_token;
    expect(accessToken).not.toBeNull();
    sender = response.body._id;
  });

  test("Test Post get API", async () => {
    const response = await request(app).get("/post");
    expect(response.statusCode).toEqual(200);
  });

  test("Test Post post API", async () => {
    const response = await request(app)
      .post("/post")
      .set({ authorization: "barer " + accessToken })
      .send({
        message: message,
        sender: sender,
      });
    expect(response.statusCode).toEqual(200);

    const retMessage = response.body.message;
    const retSender = response.body.sender;
    retId = response.body._id;

    expect(retMessage).toEqual(message);
    expect(retSender).toEqual(sender);
    expect(retId).not.toEqual(null);
  });

  test("Test get Post by id API", async () => {
    const response = await request(app).get("/post/" + retId);
    expect(response.statusCode).toEqual(200);
    const retMessage = response.body.message;
    const retSender = response.body.sender;
    const retId2 = response.body._id;
    expect(retMessage).toEqual(message);
    expect(retSender).toEqual(sender);
    expect(retId2).toEqual(retId);
  });

  test("Test get Post by sender API", async () => {
    const response = await request(app).get("/post?sender=" + sender);
    expect(response.statusCode).toEqual(200);
    const retMessage = response.body[0].message;
    const retSender = response.body[0].sender;
    const retId2 = response.body[0]._id;
    expect(retMessage).toEqual(message);
    expect(retSender).toEqual(sender);
    expect(retId2).toEqual(retId);
  });

  test("Test delete post by id API", async () => {
    const response = await request(app)
      .delete("/post/" + retId)
      .set({ authorization: "barer " + accessToken });
    expect(response.statusCode).toEqual(200);

    const response2 = await request(app).get("/post/" + retId);
    expect(response2.statusCode).toEqual(400);
  });
});
