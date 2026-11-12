/**
 * DEMONSTRATION-ONLY rate table adapted from the user-supplied pricing starter ZIP.
 * These are reference rates, not SCWork sale prices or verified supplier quotes.
 * Replace each price, minimum, area, finishing and sheet specification before publication.
 */
window.SCWORK_PRICING_DEMO = {
  sourceUrl: "User-supplied pimtook-pricing-html.zip (reference only)",
  demonstrationOnly: true,
  vatRate: 0.07,
  a3PlusSheet: {
    // ขนาดแผ่น A3+ มาตรฐาน 13 x 19 นิ้ว (~33.02 x 48.26 ซม.)
    // สามารถปรับพื้นที่ใช้งานจริงและระยะเว้นขอบ (gapCm) ได้ตามเครื่องตัด
    usableWidthCm: 31,
    usableHeightCm: 45,
    gapCm: 0.3
  },
  categories: [
    {
      id: "sticker",
      name: "สติกเกอร์ & ฉลากสินค้า",
      materials: [
        {
          id: "paper-sticker",
          name: "สติกเกอร์กระดาษ (Paper Sticker)",
          description: "ขาวเงา, ขาวด้าน — คำนวณเป็นแผ่น A3+ (13x19 นิ้ว)",
          mode: "a3_sheet",
          unitLabel: "แผ่น A3+",
          minSheets: 10,
          tiers: [
            { min: 10, max: 49, price: 35, label: "10–49 แผ่น" },
            { min: 50, max: 99, price: 25, label: "50–99 แผ่น" },
            { min: 100, max: 499, price: 23, label: "100–499 แผ่น" },
            { min: 500, max: 999, price: 21, label: "500–999 แผ่น" },
            { min: 1000, max: Infinity, price: 19, label: "1,000+ แผ่น" }
          ],
          addons: [
            { id: "lamination", name: "เคลือบเงา / เคลือบด้าน", type: "per_unit", price: 10 },
            { id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }
          ]
        },
        {
          id: "kraft-sticker",
          name: "สติกเกอร์กระดาษคราฟท์ (Kraft)",
          description: "คราฟท์น้ำตาล — คำนวณเป็นแผ่น A3+ (13x19 นิ้ว)",
          mode: "a3_sheet",
          unitLabel: "แผ่น A3+",
          minSheets: 10,
          tiers: [
            { min: 10, max: 49, price: 45, label: "10–49 แผ่น" },
            { min: 50, max: 99, price: 39, label: "50–99 แผ่น" },
            { min: 100, max: 499, price: 38, label: "100–499 แผ่น" },
            { min: 500, max: 999, price: 36, label: "500–999 แผ่น" },
            { min: 1000, max: Infinity, price: 35, label: "1,000+ แผ่น" }
          ],
          addons: [
            { id: "lamination", name: "เคลือบเงา / เคลือบด้าน", type: "per_unit", price: 10 },
            { id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }
          ]
        },
        {
          id: "pp-white",
          name: "สติกเกอร์ PP ขาว (PP White)",
          description: "ขาวเงา, ขาวด้าน, ขาวมุก — กันน้ำ 100%",
          mode: "a3_sheet",
          unitLabel: "แผ่น A3+",
          minSheets: 10,
          tiers: [
            { min: 10, max: 49, price: 45, label: "10–49 แผ่น" },
            { min: 50, max: 99, price: 35, label: "50–99 แผ่น" },
            { min: 100, max: 499, price: 32, label: "100–499 แผ่น" },
            { min: 500, max: 999, price: 29, label: "500–999 แผ่น" },
            { min: 1000, max: Infinity, price: 25, label: "1,000+ แผ่น" }
          ],
          addons: [
            { id: "lamination", name: "เคลือบเงา / เคลือบด้าน", type: "per_unit", price: 10 },
            { id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }
          ]
        },
        {
          id: "pp-clear",
          name: "สติกเกอร์ PP ใส (Clear PP)",
          description: "เนื้อใส กันน้ำ — คำนวณเป็นแผ่น A3+",
          mode: "a3_sheet",
          unitLabel: "แผ่น A3+",
          minSheets: 10,
          tiers: [
            { min: 10, max: 49, price: 45, label: "10–49 แผ่น" },
            { min: 50, max: 99, price: 37, label: "50–99 แผ่น" },
            { min: 100, max: 499, price: 35, label: "100–499 แผ่น" },
            { min: 500, max: 999, price: 33, label: "500–999 แผ่น" },
            { min: 1000, max: Infinity, price: 29, label: "1,000+ แผ่น" }
          ],
          addons: [
            { id: "lamination", name: "เคลือบเงา / เคลือบด้าน", type: "per_unit", price: 10 },
            { id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }
          ]
        },
        {
          id: "pp-silver",
          name: "สติกเกอร์ PP เงินเงา (Glossy Silver)",
          description: "เนื้อเมทัลลิกเงินเงา — คำนวณเป็นแผ่น A3+",
          mode: "a3_sheet",
          unitLabel: "แผ่น A3+",
          minSheets: 10,
          tiers: [
            { min: 10, max: 49, price: 45, label: "10–49 แผ่น" },
            { min: 50, max: 99, price: 39, label: "50–99 แผ่น" },
            { min: 100, max: 499, price: 38, label: "100–499 แผ่น" },
            { min: 500, max: 999, price: 36, label: "500–999 แผ่น" },
            { min: 1000, max: Infinity, price: 35, label: "1,000+ แผ่น" }
          ],
          addons: [
            { id: "lamination", name: "เคลือบเงา / เคลือบด้าน", type: "per_unit", price: 10 },
            { id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }
          ]
        },
        {
          id: "pvc-sqm",
          name: "สติกเกอร์ PVC แบบตารางเมตร",
          description: "คิดราคาตามพื้นที่กว้าง x ยาว (190 ฿/ตร.ม.)",
          mode: "area_sqm",
          unitLabel: "ตร.ม.",
          ratePerSqm: 190,
          minAreaSqm: 1,
          tiers: [{ min: 1, max: Infinity, price: 190, label: "1+ ตร.ม." }],
          addons: [{ id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }]
        }
      ]
    },
    {
      id: "print",
      name: "งานพิมพ์ & บัตร",
      materials: [
        {
          id: "business-card",
          name: "นามบัตร (Business Cards)",
          description: "กระดาษอาร์ตขาวเงา 250 แกรม (9x5.5 ซม.) พิมพ์ 1 หน้า",
          mode: "quantity_tier",
          unitLabel: "ใบ",
          minQty: 100,
          defaultQty: 100,
          tiers: [
            { min: 100, max: 199, price: 0.99, label: "100–199 ใบ" },
            { min: 200, max: 499, price: 0.88, label: "200–499 ใบ" },
            { min: 500, max: 999, price: 0.77, label: "500–999 ใบ" },
            { min: 1000, max: Infinity, price: 0.72, label: "1,000+ ใบ" }
          ],
          addons: [
            { id: "lamination-card", name: "เคลือบเงา / เคลือบด้าน (ประมาณ +0.60 ฿/ใบ)", type: "per_unit", price: 0.6 },
            { id: "spot-uv", name: "พิมพ์เงิน / ทอง Spot UV (+1.35 ฿/ใบ)", type: "per_unit", price: 1.35 },
            { id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }
          ]
        },
        {
          id: "pvc-card",
          name: "บัตร PVC",
          description: "ขั้นต่ำ 100 ใบ",
          mode: "quantity_tier",
          unitLabel: "ใบ",
          minQty: 100,
          defaultQty: 100,
          tiers: [
            { min: 100, max: 299, price: 15, label: "100–299 ใบ" },
            { min: 300, max: Infinity, price: 14.8, label: "300–499+ ใบ" }
          ],
          addons: [{ id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }]
        },
        {
          id: "nfc-card",
          name: "บัตร NFC",
          description: "ขั้นต่ำ 10 ใบ",
          mode: "quantity_tier",
          unitLabel: "ใบ",
          minQty: 10,
          defaultQty: 10,
          tiers: [
            { min: 10, max: 99, price: 90, label: "10–99 ใบ" },
            { min: 100, max: Infinity, price: 80, label: "100–299+ ใบ" }
          ],
          addons: [{ id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }]
        },
        {
          id: "rfid-mifare",
          name: "บัตร RFID Mifare",
          description: "ขั้นต่ำ 10 ใบ",
          mode: "quantity_tier",
          unitLabel: "ใบ",
          minQty: 10,
          defaultQty: 10,
          tiers: [{ min: 10, max: Infinity, price: 40, label: "10+ ใบ" }],
          addons: []
        },
        {
          id: "rfid-proximity",
          name: "บัตร RFID Proximity",
          description: "ขั้นต่ำ 10 ใบ",
          mode: "quantity_tier",
          unitLabel: "ใบ",
          minQty: 10,
          defaultQty: 10,
          tiers: [{ min: 10, max: Infinity, price: 35, label: "10+ ใบ" }],
          addons: []
        }
      ]
    },
    {
      id: "acrylic",
      name: "ของพรีเมียม & อะคริลิค",
      materials: [
        {
          id: "acrylic-keychain",
          name: "พวงกุญแจ / เข็มกลัดอะคริลิค",
          description: "อะคริลิคใส 3 มม. (ราคาอ้างอิงชุด 50 ชิ้น ตามขนาด)",
          mode: "size_preset",
          unitLabel: "ชิ้น",
          minQty: 50,
          defaultQty: 50,
          sizePresets: [
            { id: "3x3", label: "3 x 3 ซม.", price: 19 },
            { id: "4x4", label: "4 x 4 ซม.", price: 20 },
            { id: "5x5", label: "5 x 5 ซม.", price: 29 },
            { id: "6x6", label: "6 x 6 ซม.", price: 37 },
            { id: "8x8", label: "8 x 8 ซม.", price: 50 },
            { id: "10x10", label: "10 x 10 ซม.", price: 60 }
          ],
          addons: [
            { id: "duck-clip", name: "กิ๊บปากเป็ดสีเงิน (+4 ฿/ชิ้น)", type: "per_unit", price: 4 },
            { id: "pearl-strap", name: "เพิ่มสายไข่มุก (+5 ฿/ชิ้น)", type: "per_unit", price: 5 }
          ]
        }
      ]
    },
    {
      id: "signage",
      name: "ป้าย & งานออกบูธ",
      materials: [
        {
          id: "j-flag",
          name: "ธงญี่ปุ่น (J-Flag)",
          description: "ผ้าไวนิล + โครงเหล็กขาตั้ง",
          mode: "size_preset",
          unitLabel: "ชุด",
          minQty: 1,
          defaultQty: 1,
          sizePresets: [
            { id: "50x150", label: "50 x 150 ซม.", price: 1069 },
            { id: "50x200", label: "50 x 200 ซม.", price: 1099 },
            { id: "70x150-2side", label: "ชุดขาตั้ง 2 ด้าน 70 x 150 ซม.", price: 1500 }
          ],
          addons: [{ id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }]
        },
        {
          id: "vinyl-banner",
          name: "ป้ายไวนิล (คิดตามตารางเมตร)",
          description: "100 ฿/ตร.ม.",
          mode: "area_sqm",
          unitLabel: "ตร.ม.",
          ratePerSqm: 100,
          minAreaSqm: 1,
          tiers: [{ min: 1, max: Infinity, price: 100, label: "1+ ตร.ม." }],
          addons: [{ id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }]
        },
        {
          id: "rollup",
          name: "Roll Up (เริ่มต้น)",
          description: "ป้ายออกบูธพร้อมโครง",
          mode: "quantity_tier",
          unitLabel: "ชุด",
          minQty: 1,
          defaultQty: 1,
          tiers: [{ min: 1, max: Infinity, price: 319, label: "1+ ชุด" }],
          addons: [{ id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }]
        },
        {
          id: "x-stand",
          name: "X-Stand (เริ่มต้น)",
          description: "ป้ายออกบูธพร้อมโครง",
          mode: "quantity_tier",
          unitLabel: "ชุด",
          minQty: 1,
          defaultQty: 1,
          tiers: [{ min: 1, max: Infinity, price: 390, label: "1+ ชุด" }],
          addons: [{ id: "design", name: "บริการออกแบบ", type: "flat", price: 600 }]
        }
      ]
    }
  ]
};
