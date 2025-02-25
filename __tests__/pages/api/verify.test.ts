import { createMocks } from "node-mocks-http";
import verifyHandler, { Action } from "pages/api/verify";
import { buildAddress } from "testing/factory";

const buildOKJSONResponse = ({ result }: { result?: string }) => ({
  status: "1",
  message: "OK",
  result: result || "",
});

const buildErrorJSONResponse = ({ result }: { result?: string }) => ({
  status: "0",
  message: "Error",
  result: result || "",
});

describe("handler", () => {
  it("#check should return an error when guid is not specified", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { action: Action.Check },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Required at "guid"`,
      })
    );
  });

  it("#check should return an error when guid is not a string", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { action: Action.Check, guid: 123 },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Expected string, received number at "guid"`,
      })
    );
  });

  it("#check should return a success response when guid is valid", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { action: Action.Check, guid: "123" },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      buildOKJSONResponse({
        result: "Contract verified! ID: 123",
      })
    );
  });

  it("#verify should return an error when contractaddress is not specified", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractname: "Test.sol:Test",
        compilerversion: "0.8.0",
        sourceCode: "contract Test {}",
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Invalid address at "contractaddress"`,
      })
    );
  });

  it("#verify should return an error when contractname is not specified", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractaddress: buildAddress(),
        compilerversion: "0.8.0",
        sourceCode: "contract Test {}",
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Required at "contractname"`,
      })
    );
  });

  it("#verify should return an error when compilerversion is not specified", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractaddress: buildAddress(),
        contractname: "Test.sol:Test",
        sourceCode: "contract Test {}",
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Required at "compilerversion"`,
      })
    );
  });

  it("#verify should return an error when contractaddress is not a valid address", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractaddress: "123",
        contractname: "Test.sol:Test",
        compilerversion: "0.8.0",
        sourceCode: "contract Test {}",
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Invalid address at "contractaddress"`,
      })
    );
  });

  it("#verify should return an error when contractname is not a string", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractaddress: buildAddress(),
        contractname: 123,
        compilerversion: "0.8.0",
        sourceCode: "contract Test {}",
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Expected string, received number at "contractname"`,
      })
    );
  });

  it("#verify should return an error when compilerversion is not a string", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractaddress: buildAddress(),
        contractname: "Test.sol:Test",
        compilerversion: 123,
        sourceCode: "contract Test {}",
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Expected string, received number at "compilerversion"`,
      })
    );
  });

  it("#verify should return an error when sourceCode is not specified", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractaddress: buildAddress(),
        contractname: "Test.sol:Test",
        compilerversion: "0.8.0",
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Required at "sourceCode"`,
      })
    );
  });

  it("#verify should return an error when sourceCode is not a string", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractaddress: buildAddress(),
        contractname: "Test.sol:Test",
        compilerversion: "0.8.0",
        sourceCode: 123,
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Expected string, received number at "sourceCode"`,
      })
    );
  });

  it("#verify should return an error when contractname is not correctly formatted", () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        action: Action.Verify,
        contractaddress: buildAddress(),
        contractname: "Test.sol",
        compilerversion: "0.8.0",
        sourceCode: "contract Test {}",
      },
    });

    verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual(
      buildErrorJSONResponse({
        result: `Validation error: Expected string to match format "path:contractname" at "contractname"`,
      })
    );
  });
});
