/**
 * Admin ImageKit media integration
 * ---------------------------------
 * Backend (private key):
 *   POST   /api/media/upload   multipart `file` + optional `folder`/`section`
 *   DELETE /api/media          JSON `{ fileId }` or `{ publicId }`
 *   GET    /api/media/config   public key + urlEndpoint (no secrets)
 *
 * Folders land at: shubhdigi/admin/{folder}/
 * Content models store ImageKit fileId as `publicId` alongside `url`.
 *
 * Frontend:
 *   import { ImageKitUploadField } from "@/components/admin/media/ImageKitUploadField"
 *   import { ImageKitGalleryField } from "@/components/admin/media/ImageKitGalleryField"
 *   import { SeoImageUploadField } from "@/components/admin/media/SeoImageUploadField"
 *   import { uploadMedia, deleteMedia } from "@/lib/api/media"
 *
 * Wired media tabs: blogs, case-studies, resources, testimonials (+ SEO OG/Twitter).
 */
export {};
