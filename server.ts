import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.resolve(__dirname, "data.json");
const UPLOADS_DIR = path.resolve(__dirname, "uploads");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return { books: [], orders: [], offers: [], activities: [], messages: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
};
const writeData = (data: any) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// API
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || "AZIZJED";
  const adminPass = process.env.ADMIN_PASSWORD || "GOLDEN-LIB-SECURE-8x9P-2v5R-K9zQ";
  res.json({ success: user === adminUser && pass === adminPass });
});

app.get("/api/books", (req, res) => {
  const data = readData();
  const activeOffers = (data.offers || []).filter((o: any) => o.isActive);
  const now = new Date().toISOString().split('T')[0];
  
  const books = (data.books || []).map((book: any) => {
    let bestDiscount = 0;
    activeOffers.forEach((offer: any) => {
      // Check date validity
      if (offer.startDate <= now && offer.endDate >= now) {
        const isTargeted = offer.target === 'all' || (offer.target === 'specific' && offer.bookIds?.includes(book.id));
        if (isTargeted && offer.discountPercentage > bestDiscount) {
          bestDiscount = offer.discountPercentage;
        }
      }
    });

    const currentSalePrice = book.salePrice;
    let finalSalePrice: number | undefined = undefined;

    // Check individual book sale range
    const isBookOnSale = book.saleRange 
      ? (book.saleRange.start <= now && book.saleRange.end >= now)
      : true;

    if (isBookOnSale && currentSalePrice !== undefined) {
      finalSalePrice = currentSalePrice;
    }

    let calculatedOfferPrice = bestDiscount > 0 ? (book.price * (1 - bestDiscount / 100)) : undefined;

    // If we have both, take the lowest (best for customer)
    let resultSalePrice = finalSalePrice;
    if (calculatedOfferPrice !== undefined) {
      if (resultSalePrice === undefined || calculatedOfferPrice < resultSalePrice) {
        resultSalePrice = calculatedOfferPrice;
      }
    }

    return { 
      ...book, 
      salePrice: resultSalePrice ? Number(resultSalePrice.toFixed(2)) : undefined 
    };
  });
  res.json(books);
});
app.post("/api/books", (req, res) => {
  const data = readData();
  const book = { id: Date.now().toString(), ...req.body };
  data.books.push(book);
  writeData(data);
  res.json(book);
});
app.put("/api/books/:id", (req, res) => {
  const data = readData();
  const idx = data.books.findIndex((b: any) => b.id === req.params.id);
  if (idx !== -1) { data.books[idx] = { ...data.books[idx], ...req.body }; writeData(data); res.json(data.books[idx]); }
  else res.status(404).send();
});
app.delete("/api/books/:id", (req, res) => {
  const data = readData();
  data.books = data.books.filter((b: any) => b.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

app.get("/api/orders", (req, res) => res.json(readData().orders));
app.post("/api/orders", (req, res) => {
  const data = readData();
  const order = { id: "ORD-" + Date.now(), ...req.body, status: "New", date: new Date().toISOString() };
  data.orders.push(order);
  writeData(data);
  res.json(order);
});
app.put("/api/orders/:id", (req, res) => {
  const data = readData();
  const o = data.orders.find((ord: any) => ord.id === req.params.id);
  if (o) { Object.assign(o, req.body); writeData(data); res.json(o); }
  else res.status(404).send();
});

app.get("/api/offers", (req, res) => res.json(readData().offers || []));
app.post("/api/offers", (req, res) => {
  const data = readData();
  const offer = { id: Date.now().toString(), ...req.body };
  data.offers = [...(data.offers || []), offer];
  writeData(data);
  res.json(offer);
});
app.put("/api/offers/:id/toggle", (req, res) => {
  const data = readData();
  const index = (data.offers || []).findIndex((o: any) => o.id === req.params.id);
  if (index !== -1) {
    data.offers[index].isActive = !data.offers[index].isActive;
    writeData(data);
    res.json(data.offers[index]);
  } else {
    res.status(404).send();
  }
});
app.delete("/api/offers/:id", (req, res) => {
  const data = readData();
  data.offers = (data.offers || []).filter((o: any) => o.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

app.get("/api/activities", (req, res) => res.json((readData().activities || []).slice(0, 100)));
app.post("/api/activities", (req, res) => {
  const data = readData();
  const activity = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...req.body };
  data.activities = [activity, ...(data.activities || [])].slice(0, 500);
  writeData(data);
  res.json(activity);
});

app.get("/api/messages", (req, res) => res.json(readData().messages || []));
app.post("/api/messages", (req, res) => {
  const data = readData();
  const message = { id: Date.now().toString(), date: new Date().toISOString(), ...req.body };
  data.messages = [message, ...(data.messages || [])];
  writeData(data);
  res.json(message);
});

app.delete("/api/messages/:id", (req, res) => {
  const data = readData();
  data.messages = (data.messages || []).filter((m: any) => m.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send();
  res.json({ path: "/uploads/" + req.file.filename });
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "dist/index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server: http://localhost:${PORT}`));
}
start();
