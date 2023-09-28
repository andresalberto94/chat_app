import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
import * as addressService from "./services/services.js";


configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const addMessages = async (request) => {
  const formData = await request.formData();

  const sender = formData.get("sender");
  const message = formData.get("message");

  await addressService.create(sender, message);

  return redirectTo("/");
};

const listMessages = async (request) => {
  const data = {
    messages: await addressService.findAll(),
  };

  return new Response(await renderFile("count.eta", data), responseDetails);
};

const handleRequest = async (request) => {
  //const url = new URL(request.url);
  if (request.method === "GET") {
    return await listMessages(request);
  } else if (request.method === "POST") {
    return await addMessages(request);
  } else {
    return await listMessages(request);
  }
};

serve(handleRequest, { port: 7777 });