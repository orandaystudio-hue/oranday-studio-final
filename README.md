# Oranday Studio

Sitio estático en español de México para empresas de climatización y paneles solares de Monterrey. Vercel sirve los archivos desde la raíz del repositorio. No requiere compilación ni dependencias de JavaScript.

## Vista local

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8765/`. La demo está integrada en la portada y también abre como página independiente en `/demo/`. El parámetro `giro=climas` o `giro=solar` selecciona el ejemplo inicial. Los datos son simulados y los controles emiten `oranday:demo` dentro del navegador.

## Datos estructurados

| Ruta | JSON-LD |
| --- | --- |
| `/` | Organization, WebSite y WebPage |
| `/captacion-climatizacion-monterrey/` | WebPage, Service y BreadcrumbList |
| `/captacion-paneles-solares-monterrey/` | WebPage, Service y BreadcrumbList |
| `/demo/` | WebPage, LearningResource y BreadcrumbList |
| `/recursos/seguimiento-cotizaciones-whatsapp/` | WebPage, Article y BreadcrumbList |
| `/aviso-de-privacidad/` | WebPage y BreadcrumbList |
| `/brand-system.html` | WebPage |

Los tipos Service describen la captación y el seguimiento que Oranday presta a los instaladores. Los ejemplos de la demo son ficticios. Las preguntas frecuentes se mantienen como contenido visible.

## Operación

- Las acciones de contacto emiten `oranday:contact` con evento, ruta y posición. `script.js` puede pasar el evento a un `dataLayer` ya inicializado. El sitio no instala un proveedor de analítica. Los clics y las consultas recibidas se registran por separado.
- Los canonicals y el sitemap apuntan al dominio de producción. Las vistas previas de Vercel deben entregar el encabezado `X-Robots-Tag: noindex`. Los enlaces heredados de la portada `#servicios`, `#proceso`, `#resultados` y `#faq` siguen disponibles.
- Antes de promover, confirmar el contacto comercial y completar el aviso integral con la identidad y domicilio del responsable y el procedimiento aplicable. Verificar el sitemap y cada ruta en Search Console después de publicar.
- `components/ui/` y `tailwind.config.ts` son referencias históricas fuera del sitio. La interfaz usa CSS nativo. Las licencias de Archivo e Inter están en `assets/`.
