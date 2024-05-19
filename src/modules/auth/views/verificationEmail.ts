import { Html } from "../../../utils/html";

export default {
  render(url: string) {
    const basePath = process.cwd();
    const modulePath = `${basePath}/src/modules/auth/views`;
    const htmlPath = `${modulePath}/html/verificationEmail.html`;
    return new Html(htmlPath, {
      url,
    }).render();
  },
};
