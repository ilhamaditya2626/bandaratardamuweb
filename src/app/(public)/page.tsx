import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { DynamicImage } from "@/components/dynamic-image";
import { HeroSlider } from "@/components/hero-slider";
import { buildPageMetadata, siteConfig } from "@/lib/seo";
import { getFlightsByDate } from "@/services/flights.service";
import { getAllNews } from "@/services/news.service";

export const metadata = buildPageMetadata({
  title: siteConfig.name,
  description:
    "Portal resmi Bandar Udara Tardamu Sabu Raijua untuk jadwal penerbangan, cuaca terkini, berita terbaru, dan informasi layanan publik.",
  path: "/",
});

export const revalidate = 1800;

type WeatherSnapshot = {
  temperature: number;
  windSpeed: number;
  relativeHumidity: number;
  weatherCode: number;
  isDay: boolean;
};

function getTodayDateInSabuRaijua() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getCurrentHourInSabuRaijua() {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date());

  return Number(hour);
}

async function getSabuWeather() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-10.5&longitude=121.8333&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=Asia%2FMakassar",
      { next: { revalidate: 1800 } }
    );

    if (!res.ok) throw new Error("Failed to fetch weather from Open-Meteo");

    const data = await res.json();
    const current = data?.current;

    if (!current) {
      throw new Error("Open-Meteo response did not include current weather data");
    }

    return {
      temperature: current.temperature_2m,
      windSpeed: current.wind_speed_10m,
      relativeHumidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      isDay: Boolean(current.is_day),
    } satisfies WeatherSnapshot;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

function getWeatherDescriptionFromWmoCode(weatherCode?: number, isDay = true) {
  switch (weatherCode) {
    case 0:
      return isDay ? "Cerah" : "Cerah Malam";
    case 1:
    case 2:
      return isDay ? "Cerah Berawan" : "Berawan Malam";
    case 3:
      return "Berawan";
    case 45:
    case 48:
      return "Berkabut";
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return "Gerimis";
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return "Hujan";
    case 66:
    case 67:
      return "Hujan Beku";
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return "Salju";
    case 95:
    case 96:
    case 99:
      return "Badai Petir";
    default:
      return isDay ? "Berawan" : "Berawan Malam";
  }
}

function getWeatherIconFromWmoCode(weatherCode?: number, isDay = true) {
  switch (weatherCode) {
    case 0:
      return isDay ? "fa-sun" : "fa-moon";
    case 1:
    case 2:
      return isDay ? "fa-cloud-sun" : "fa-cloud-moon";
    case 3:
      return "fa-cloud";
    case 45:
    case 48:
      return "fa-smog";
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return "fa-cloud-rain";
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return "fa-snowflake";
    case 95:
    case 96:
    case 99:
      return "fa-cloud-bolt";
    default:
      return isDay ? "fa-cloud-sun" : "fa-cloud-moon";
  }
}

function formatTodayLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatNewsDate(date: Date | string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function cleanNewsPreview(content: string) {
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getStatusClass(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "landed":
    case "ontime":
      return "status--landed";
    case "boarding":
      return "status--boarding";
    case "delayed":
      return "status--delayed";
    case "cancelled":
      return "status--cancelled";
    case "enroute":
      return "status--enroute";
    default:
      return "status--scheduled";
  }
}

export default async function HomePage() {
  const today = getTodayDateInSabuRaijua();
  const todayLabel = formatTodayLabel(today);

  const currentHour = getCurrentHourInSabuRaijua();
  const isNight = currentHour >= 18 || currentHour < 6;
  const [weatherResult, flightsResult, newsResult] = await Promise.allSettled([
    getSabuWeather(),
    getFlightsByDate(today),
    getAllNews(1, 3),
  ]);

  if (flightsResult.status === "rejected") {
    console.error("Failed to load homepage flights:", flightsResult.reason);
  }

  if (newsResult.status === "rejected") {
    console.error("Failed to load homepage news:", newsResult.reason);
  }

  const weatherData = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const flights = flightsResult.status === "fulfilled" ? flightsResult.value : [];
  const latestNews = newsResult.status === "fulfilled" ? newsResult.value.data : [];
  const temp = Math.round(weatherData?.temperature ?? 30);
  const wind = Math.round(weatherData?.windSpeed ?? 28);
  const humidity = Math.round(weatherData?.relativeHumidity ?? 75);
  const weatherIsDay = weatherData?.isDay ?? !isNight;
  const weatherDesc = getWeatherDescriptionFromWmoCode(weatherData?.weatherCode, weatherIsDay);
  const weatherIcon = getWeatherIconFromWmoCode(weatherData?.weatherCode, weatherIsDay);

  const featuredFlights = flights.slice(0, 5);

  return (
    <>
      <HeroSlider />

      <section className="info-section" id="penerbangan">
        <div className="info-section__container">
          <div className="flight-card glass-card">
            <div className="flight-card__header">
              <i className="fa-solid fa-plane"></i>
              <div>
                <h2>Jadwal Penerbangan Hari Ini</h2>
                <p
                  style={{
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {todayLabel}
                </p>
              </div>
            </div>
            <div className="flight-card__table-wrapper">
              <table className="flight-table" id="flightTable">
                <thead>
                  <tr>
                    <th>Maskapai</th>
                    <th>Asal - Tujuan</th>
                    <th>Waktu</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {featuredFlights.length > 0 ? (
                    featuredFlights.map((flight) => {
                      const from = flight.type === "arrival" ? flight.origin || "-" : "Sabu (SAU)";
                      const to = flight.type === "arrival" ? "Sabu (SAU)" : flight.destination || "-";
                      const displayTime =
                        flight.type === "arrival"
                          ? flight.estimated_time || flight.scheduled_time || "-"
                          : flight.scheduled_time || flight.estimated_time || "-";
                      const statusLabel = flight.status_label || flight.status || "Scheduled";
                      const notes = flight.notes?.trim();

                      return (
                        <Fragment key={flight.id}>
                          <tr>
                            <td>
                              <strong>{flight.airline}</strong> {flight.flight_no}
                            </td>
                            <td>
                              {from} <i className="fa-solid fa-arrow-right"></i> {to}
                            </td>
                            <td>{displayTime}</td>
                            <td>
                              <span className={`status-badge ${getStatusClass(flight.status)}`}>
                                <i className="fa-solid fa-circle"></i> {statusLabel}
                              </span>
                            </td>
                          </tr>
                          {notes ? (
                            <tr className="flight-table__note-row">
                              <td colSpan={4}>
                                <div className="flight-table__note">
                                  <span className="flight-table__note-icon">
                                    <i className="fa-solid fa-circle-info"></i>
                                  </span>
                                  <div className="flight-table__note-content">
                                    <strong>Catatan penerbangan</strong>
                                    <p>{notes}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: "28px 18px",
                          textAlign: "center",
                          color: "var(--text-secondary)",
                          fontStyle: "italic",
                        }}
                      >
                        Belum ada data penerbangan untuk hari ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Link href="/penerbangan" className="flight-card__more">
              Lihat Semua Jadwal <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="weather-card glass-card">
            <div className="weather-card__header">
              <i className={`fa-solid ${weatherIcon}`}></i>
              <h2>Info Cuaca Sabu Raijua</h2>
            </div>
            <div className="weather-card__body">
              <div className="weather-card__main">
                <div className="weather-card__icon">
                  <i className={`fa-solid ${weatherIcon}`}></i>
                </div>
                <div className="weather-card__temp">
                  <span className="weather-card__degrees">{temp}°C</span>
                  <span className="weather-card__desc">{weatherDesc}</span>
                </div>
              </div>
              <div className="weather-card__details">
                <div className="weather-detail">
                  <i className="fa-solid fa-wind"></i>
                  <span>
                    Angin: <strong>{wind} km/jam</strong>
                  </span>
                </div>
                <div className="weather-detail">
                  <i className="fa-solid fa-droplet"></i>
                  <span>
                    Kelembapan: <strong>{humidity}%</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-actions" id="transportasi">
        <div className="quick-actions__container">
          <Link href="/tentang" className="quick-action glass-card" id="qa-transportasi">
            <div className="quick-action__icon">
              <i className="fa-solid fa-van-shuttle"></i>
              <i className="fa-solid fa-plane-arrival"></i>
            </div>
            <span className="quick-action__label">Tentang Bandara</span>
          </Link>
          <Link href="/fasilitas" className="quick-action glass-card" id="qa-fasilitas">
            <div className="quick-action__icon">
              <i className="fa-solid fa-building-columns"></i>
            </div>
            <span className="quick-action__label">Fasilitas Bandara</span>
          </Link>
          <Link href="/jelajah-sabu" className="quick-action glass-card" id="qa-wisata">
            <div className="quick-action__icon">
              <i className="fa-solid fa-umbrella-beach"></i>
            </div>
            <span className="quick-action__label">Jelajah Sabu</span>
          </Link>
          <Link href="/bantuan" className="quick-action glass-card" id="qa-event">
            <div
              className="quick-action__icon"
              style={{
                height: "80px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <Image
                src="/assets/images/3.webp"
                alt="Ikon pusat bantuan"
                width={40}
                height={40}
                style={{ height: "40px", width: "auto" }}
              />
            </div>
            <span className="quick-action__label">
              Pusat Bantuan
            </span>
          </Link>
        </div>
      </section>

      <section className="tourism" id="jelajah">
        <div className="tourism__container">
          <Link href="/destinasi-wisata" className="tourism-card" id="card-kelabba">
            <Image
              src="/assets/images/kelabba-maja.webp"
              alt="Kelabba Maja - Situs Megalitikum di Pulau Sabu"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="tourism-card__overlay">
              <span className="tourism-card__tag">Destinasi Favorit</span>
              <h3 className="tourism-card__title">Kelabba Maja</h3>
            </div>
          </Link>
          <Link href="/destinasi-wisata" className="tourism-card" id="card-festival">
            <Image
              src="/assets/images/festival-hole.webp"
              alt="Festival Hole - Festival Budaya Sabu Raijua"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="tourism-card__overlay">
              <span className="tourism-card__tag">Festival Hole 2025</span>
              <h3 className="tourism-card__title">Saksikan Budaya Sabu</h3>
            </div>
          </Link>
        </div>
      </section>

      <section className="latest-news" id="berita-terbaru">
        <div className="latest-news__container">
          <div className="latest-news__header">
            <div>
              <span className="latest-news__eyebrow">
                <i className="fa-solid fa-newspaper"></i>
                Kabar Bandara
              </span>
              <h2>Berita & Pengumuman Terbaru</h2>
              <p>
                Informasi terkini seputar pelayanan, operasional, dan agenda
                Bandara Tardamu Sabu Raijua.
              </p>
            </div>
            <Link href="/berita" className="latest-news__all-link">
              Lihat Semua <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="latest-news__grid">
              {latestNews.map((article, index) => {
                const preview = cleanNewsPreview(article.content);

                return (
                  <Link
                    key={article.id}
                    href={`/berita/${article.slug}`}
                    className={`latest-news-card ${index === 0 ? "latest-news-card--featured" : ""}`}
                  >
                    <div className="latest-news-card__image">
                      <DynamicImage
                        src={article.image_url || "/assets/images/hero-bg.webp"}
                        alt={article.title}
                        fill
                        sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                      />
                    </div>
                    <div className="latest-news-card__body">
                      <div className="latest-news-card__meta">
                        <span>
                          <i className="fa-regular fa-calendar"></i>
                          {formatNewsDate(article.created_at)}
                        </span>
                        <span>{article.author || "Redaksi Bandara"}</span>
                      </div>
                      <h3>{article.title}</h3>
                      <p suppressHydrationWarning>{preview}</p>
                      <span className="latest-news-card__read" suppressHydrationWarning>
                        <span>Baca Selengkapnya</span> <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="latest-news__empty glass-card">
              <i className="fa-regular fa-newspaper"></i>
              <p>Belum ada berita terbaru yang dipublikasikan.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
