import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function seedTicketPrices() {
  const [{ db }, { ticketPrices }] = await Promise.all([
    import("./src/db"),
    import("./src/db/schema"),
  ]);

  await db
    .insert(ticketPrices)
    .ignore()
    .values([
      {
        route_key: "kupang-sabu",
        origin: "Kupang",
        destination: "Sabu",
        flight_type: "reguler",
        operating_days: [
          "senin",
          "selasa",
          "rabu",
          "kamis",
          "jumat",
          "sabtu",
          "minggu",
        ],
        price: 1250000,
        is_active: true,
      },
      {
        route_key: "sabu-kupang",
        origin: "Sabu",
        destination: "Kupang",
        flight_type: "reguler",
        operating_days: [
          "senin",
          "selasa",
          "rabu",
          "kamis",
          "jumat",
          "sabtu",
          "minggu",
        ],
        price: 1180000,
        is_active: true,
      },
      {
        route_key: "ende-sabu",
        origin: "Ende",
        destination: "Sabu",
        flight_type: "perintis",
        operating_days: ["senin", "rabu", "jumat"],
        price: 850000,
        is_active: true,
      },
      {
        route_key: "sabu-waingapu",
        origin: "Sabu",
        destination: "Waingapu",
        flight_type: "perintis",
        operating_days: ["selasa", "kamis"],
        price: 920000,
        is_active: true,
      },
    ]);

  console.log("Seeded ticket prices.");
}

seedTicketPrices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed ticket prices:", error);
    process.exit(1);
  });
