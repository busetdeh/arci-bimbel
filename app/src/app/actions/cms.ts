"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  CmsArticleItem,
  CmsTestimonialItem,
  CmsBannerItem,
  CmsFaqItem,
  CmsDataResult,
  CmsStatus,
  INITIAL_CMS_ARTICLES,
  INITIAL_CMS_TESTIMONIALS,
  INITIAL_CMS_BANNERS,
  INITIAL_CMS_FAQS,
} from "@/lib/cms-constants";

// In-memory persistent cache for server lifecycle
let cmsArticlesStore: CmsArticleItem[] = [...INITIAL_CMS_ARTICLES];
let cmsTestimonialsStore: CmsTestimonialItem[] = [...INITIAL_CMS_TESTIMONIALS];
let cmsBannersStore: CmsBannerItem[] = [...INITIAL_CMS_BANNERS];
let cmsFaqsStore: CmsFaqItem[] = [...INITIAL_CMS_FAQS];

/**
 * Fetch all CMS content, announcements, and metrics
 */
export async function getCmsDataAction(): Promise<CmsDataResult> {
  try {
    const supabase = createAdminClient();

    // Fetch announcements from Supabase to incorporate into articles/news if available
    const { data: dbAnnouncements } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    // If there are announcements from Supabase not yet in articles, add them
    if (dbAnnouncements && dbAnnouncements.length > 0) {
      dbAnnouncements.forEach((ann: any) => {
        const existing = cmsArticlesStore.find((a) => a.id === ann.id);
        if (!existing) {
          cmsArticlesStore.unshift({
            id: ann.id,
            title: ann.title,
            slug: ann.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            category: "Pengumuman",
            categoryBadge: "bg-teal-100 text-teal-800",
            status: ann.status === "sent" ? "Terbit (Live)" : "Draft",
            statusColor: ann.status === "sent" ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
            views: ann.recipients_count ? ann.recipients_count * 15 : 120,
            publishedAt: ann.created_at ? new Date(ann.created_at).toLocaleDateString("id-ID") : "Terbit",
            author: "Admin Akademik ARCI",
            summary: ann.content.slice(0, 120) + "...",
            content: ann.content,
          });
        }
      });
    }

    const totalViews = cmsArticlesStore.reduce((acc, a) => acc + (a.views || 0), 0);
    const publishedCount = cmsArticlesStore.filter((a) => a.status === "Terbit (Live)").length;
    const draftCount = cmsArticlesStore.filter((a) => a.status === "Draft").length;

    const metrics = {
      totalArticles: cmsArticlesStore.length,
      publishedArticles: publishedCount,
      draftArticles: draftCount,
      totalViews,
      verifiedTestimonials: cmsTestimonialsStore.filter((t) => t.isVerified).length,
      activeBanners: cmsBannersStore.filter((b) => b.isActive).length,
      totalFaqs: cmsFaqsStore.length,
    };

    return {
      success: true,
      articles: cmsArticlesStore,
      testimonials: cmsTestimonialsStore,
      banners: cmsBannersStore,
      faqs: cmsFaqsStore,
      metrics,
    };
  } catch (err: any) {
    console.error("Error fetching CMS data:", err);
    return {
      success: false,
      articles: cmsArticlesStore,
      testimonials: cmsTestimonialsStore,
      banners: cmsBannersStore,
      faqs: cmsFaqsStore,
      metrics: {
        totalArticles: cmsArticlesStore.length,
        publishedArticles: 3,
        draftArticles: 1,
        totalViews: 7890,
        verifiedTestimonials: 3,
        activeBanners: 2,
        totalFaqs: 4,
      },
      message: err.message || "Gagal memuat data CMS dari Supabase",
    };
  }
}

/**
 * Save / Update existing article
 */
export async function saveArticleAction(
  article: CmsArticleItem
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    const idx = cmsArticlesStore.findIndex((a) => a.id === article.id);
    if (idx !== -1) {
      cmsArticlesStore[idx] = {
        ...cmsArticlesStore[idx],
        ...article,
      };
    } else {
      cmsArticlesStore.unshift(article);
    }

    // Record in audit_logs
    await supabase.from("audit_logs").insert({
      action: "CMS_ARTICLE_SAVED",
      details: {
        article_id: article.id,
        title: article.title,
        status: article.status,
        author: article.author,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/cms");
    revalidatePath("/");

    return {
      success: true,
      message: `Artikel "${article.title}" berhasil disimpan dan diperbarui!`,
    };
  } catch (err: any) {
    console.error("Error saving article:", err);
    return {
      success: false,
      message: err.message || "Gagal menyimpan perubahan artikel.",
    };
  }
}

/**
 * Create a new article
 */
export async function createArticleAction(payload: {
  title: string;
  category: string;
  author: string;
  summary: string;
  content?: string;
  status: CmsStatus;
}): Promise<{ success: boolean; article?: CmsArticleItem; message: string }> {
  try {
    const supabase = createAdminClient();

    const slug = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newId = `ART-${String(cmsArticlesStore.length + 1).padStart(2, "0")}`;

    const newArticle: CmsArticleItem = {
      id: newId,
      title: payload.title,
      slug,
      category: payload.category,
      categoryBadge:
        payload.category === "Tips UTBK"
          ? "bg-blue-100 text-blue-800"
          : payload.category === "Konseling Karir"
          ? "bg-purple-100 text-purple-800"
          : "bg-emerald-100 text-emerald-800",
      status: payload.status,
      statusColor:
        payload.status === "Terbit (Live)"
          ? "bg-success/15 text-success"
          : "bg-warning/15 text-warning",
      views: 0,
      publishedAt:
        payload.status === "Terbit (Live)"
          ? new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
          : "Draft",
      author: payload.author || "Tim Redaksi ARCI",
      summary: payload.summary,
      content: payload.content || payload.summary,
    };

    cmsArticlesStore.unshift(newArticle);

    // Sync to audit_logs
    await supabase.from("audit_logs").insert({
      action: "CMS_ARTICLE_CREATED",
      details: {
        article_id: newId,
        title: payload.title,
        status: payload.status,
        author: payload.author,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/cms");
    revalidatePath("/");

    return {
      success: true,
      article: newArticle,
      message: `Artikel baru "${payload.title}" berhasil dibuat dan disimpan!`,
    };
  } catch (err: any) {
    console.error("Error creating article:", err);
    return {
      success: false,
      message: err.message || "Gagal membuat artikel baru.",
    };
  }
}

/**
 * Delete an article
 */
export async function deleteArticleAction(
  articleId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    const target = cmsArticlesStore.find((a) => a.id === articleId);
    cmsArticlesStore = cmsArticlesStore.filter((a) => a.id !== articleId);

    await supabase.from("audit_logs").insert({
      action: "CMS_ARTICLE_DELETED",
      details: {
        article_id: articleId,
        title: target?.title,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/cms");
    revalidatePath("/");

    return {
      success: true,
      message: `Artikel "${target?.title || articleId}" berhasil dihapus.`,
    };
  } catch (err: any) {
    console.error("Error deleting article:", err);
    return {
      success: false,
      message: err.message || "Gagal menghapus artikel.",
    };
  }
}

/**
 * Toggle or save promotional banner
 */
export async function saveBannerAction(
  banner: CmsBannerItem
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    const idx = cmsBannersStore.findIndex((b) => b.id === banner.id);
    if (idx !== -1) {
      cmsBannersStore[idx] = banner;
    } else {
      cmsBannersStore.push(banner);
    }

    await supabase.from("audit_logs").insert({
      action: "CMS_BANNER_SAVED",
      details: {
        banner_id: banner.id,
        title: banner.title,
        is_active: banner.isActive,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/cms");
    revalidatePath("/");

    return {
      success: true,
      message: `Banner promo "${banner.title}" berhasil diperbarui!`,
    };
  } catch (err: any) {
    console.error("Error saving banner:", err);
    return {
      success: false,
      message: err.message || "Gagal memperbarui banner promo.",
    };
  }
}

/**
 * Toggle or save testimonial
 */
export async function saveTestimonialAction(
  testi: CmsTestimonialItem
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    const idx = cmsTestimonialsStore.findIndex((t) => t.id === testi.id);
    if (idx !== -1) {
      cmsTestimonialsStore[idx] = testi;
    } else {
      cmsTestimonialsStore.unshift(testi);
    }

    await supabase.from("audit_logs").insert({
      action: "CMS_TESTIMONIAL_SAVED",
      details: {
        testi_id: testi.id,
        name: testi.name,
        is_verified: testi.isVerified,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/cms");
    revalidatePath("/");

    return {
      success: true,
      message: `Testimoni dari ${testi.name} berhasil diperbarui!`,
    };
  } catch (err: any) {
    console.error("Error saving testimonial:", err);
    return {
      success: false,
      message: err.message || "Gagal memperbarui testimoni.",
    };
  }
}

/**
 * Save FAQ item
 */
export async function saveFaqAction(
  faq: CmsFaqItem
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    const idx = cmsFaqsStore.findIndex((f) => f.id === faq.id);
    if (idx !== -1) {
      cmsFaqsStore[idx] = faq;
    } else {
      cmsFaqsStore.push(faq);
    }

    await supabase.from("audit_logs").insert({
      action: "CMS_FAQ_SAVED",
      details: {
        faq_id: faq.id,
        question: faq.question,
        category: faq.category,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/cms");
    revalidatePath("/");

    return {
      success: true,
      message: `Tanya Jawab (FAQ) berhasil diperbarui!`,
    };
  } catch (err: any) {
    console.error("Error saving FAQ:", err);
    return {
      success: false,
      message: err.message || "Gagal memperbarui FAQ.",
    };
  }
}
