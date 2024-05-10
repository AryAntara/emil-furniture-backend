import { html } from "hono/html";

export default {
    render(
        url: string
    ) {
        return `

<h1>Emil store</h1>
<p>Ini adalah EMAIL verifikasi oleh Emil Furniture. Mohon
untuk melakukan verifikasi agar kamu bisa login ke Emil Furniture.
Kamu bisa klik tombol dibawah</p>
<br>
<a href="${url}">Verikasi disini</a>
`
    }
}