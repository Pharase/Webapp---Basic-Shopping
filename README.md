# Borrow&lend

เว็บแอปสำหรับแสดงสินค้า เพิ่มสินค้าในตะกร้า และจัดการสินค้าโดยผู้ดูแลระบบ พัฒนาแยกเป็น Angular frontend, Spring Boot backend และ PostgreSQL database

## สิ่งที่ต้องมี

- Docker Desktop และ Docker Compose
- Java 21
- Node.js และ npm
- Git (ถ้าดึง source จาก repository)

## โครงสร้างโปรเจกต์

```text
.
├── back/                # Spring Boot API
├── front/               # Angular web application
├── docker-compose.yaml  # PostgreSQL และ service containers
├── database/init/       # SQL สร้างตารางและข้อมูลเริ่มต้น
└── README.md
```

## รันทั้งระบบด้วย Batch

หลังติดตั้งและเปิด Docker Desktop แล้ว สามารถเริ่ม database, backend และ frontend พร้อมกันด้วย:

```text
run-project.bat
```

คำสั่งเพิ่มเติม:

```text
run-project.bat logs   # ดู log ของ backend และ frontend
run-project.bat stop   # หยุดและลบ containers แต่ไม่ลบ database volume
```

Batch file จะตรวจ Docker, pull PostgreSQL image, ติดตั้ง npm dependencies ระหว่าง build frontend image และ start services ด้วย Docker Compose

ค่าการเชื่อมต่อปัจจุบัน:

```text
Host:     localhost
Port:     5432
Database: localdb
Username: postgres
Password: postgres
```

ตรวจสอบสถานะ database:

```powershell
docker compose ps
```

หยุด database โดยไม่ลบข้อมูล:

```powershell
docker compose stop postgres
```

ถ้าต้องการลบ container และข้อมูลใน volume ด้วย ให้ใช้คำสั่งนี้ด้วยความระมัดระวัง:

```powershell
docker compose down -v
```

## เริ่ม Backend

เปิด terminal ใหม่:

```powershell
Set-Location .\back
.\mvnw.cmd clean test
.\mvnw.cmd spring-boot:run
```

Backend จะทำงานที่:

```text
http://localhost:8080
```

Backend ใช้ฐานข้อมูลจาก `back/src/main/resources/application.properties` และตั้ง `spring.jpa.hibernate.ddl-auto=update` เพื่อ update schema ที่จำเป็นอัตโนมัติ

## เริ่ม Frontend

เปิด terminal อีกหน้าต่าง:

```powershell
Set-Location .\front
npm install
npm start
```

เปิดเว็บที่:

```text
http://localhost:4200
```

Frontend เรียก API ที่ `http://localhost:8080` และใช้ session cookie สำหรับ login/logout จึงต้องเปิด backend ให้ทำงานก่อนทดสอบระบบสมาชิกและ checkout

## รันด้วย Docker Compose

ไฟล์ `docker-compose.yaml` เตรียม service `postgres`, `back` และ `front` ไว้:

```powershell
docker compose up --build
```

ทั้งสาม service ใช้ Docker configuration ได้ทันที โดย `front/Dockerfile` จะ build Angular SSR และเปิด frontend ที่ `http://localhost:4200` ส่วน backend เปิดที่ `http://localhost:8080`

PostgreSQL จะ mount `database/init` เข้าไปใน `/docker-entrypoint-initdb.d` และ `run-project.bat` จะเรียก SQL ทั้งสองไฟล์อีกครั้งหลัง database พร้อม:

- `01-schema.sql` สร้างตาราง `users`, `categories`, `products`, `orders` และ `order_items`
- `02-seed.sql` เพิ่ม user, category และ product ตัวอย่างแบบไม่ซ้ำ

ไฟล์ seed ใช้ `ON CONFLICT` และ `NOT EXISTS` จึงรันซ้ำกับ volume เดิมได้ แต่ user ที่มี username อยู่แล้วจะไม่ถูกเขียนทับ

## ความสามารถของระบบ

### ผู้ใช้ทั่วไป

- ดูรายการสินค้าจาก database ในรูปแบบตาราง
- เห็นชื่อ หมวดหมู่ รายละเอียด ราคา และ stock
- เพิ่มสินค้าเข้าตะกร้าได้เมื่อ login แล้ว
- เพิ่มหรือลดจำนวนสินค้าในตะกร้า
- ยกเลิกรายการสินค้าออกจากตะกร้า
- checkout เพื่อสร้าง order และ order items
- ระบบตรวจ stock ก่อน checkout และตัด stock ใน database จริง
- ถ้า stock ไม่พอ transaction จะ rollback

### Register และ Login

- Register ด้วย username, full name, email และ password
- ตรวจ username/email ซ้ำ
- password ถูก hash ด้วย BCrypt cost factor 10
- login ตรวจ password ด้วย BCrypt `matches`
- role ใหม่จาก register ถูกกำหนดเป็น `user` ที่ backend
- logout ล้าง session จาก backend

### Admin

เมื่อ user มี `role = admin`:

- เห็นรายการ category จาก database
- เพิ่มสินค้าใหม่
- แก้ไขสินค้าเดิม
- เลือก category เดิมได้
- พิมพ์ category ใหม่ได้ และระบบจะสร้าง category ใน database อัตโนมัติ
- backend ป้องกัน endpoint เพิ่ม/แก้ไขสินค้าด้วย session role และตอบ `403` หากไม่ใช่ admin

## API หลัก

| Method | Endpoint | รายละเอียด |
|---|---|---|
| GET | `/api/products` | ดึงรายการสินค้า |
| POST | `/api/products` | เพิ่มสินค้า, admin เท่านั้น |
| PUT | `/api/products/{id}` | แก้ไขสินค้า, admin เท่านั้น |
| GET | `/api/categories` | ดึงรายการ category |
| POST | `/api/categories` | เพิ่ม category, admin เท่านั้น |
| POST | `/api/users/register` | สมัครสมาชิก |
| POST | `/api/users/login` | login และสร้าง session |
| POST | `/api/users/logout` | logout และล้าง session |
| POST | `/api/orders` | checkout และตัด stock |

## คำสั่งตรวจสอบและ Build

Frontend:

```powershell
Set-Location .\front
npm run build
npm test
```

Backend:

```powershell
Set-Location .\back
.\mvnw.cmd clean test
```

ปัจจุบัน backend ยังไม่มี test source และ frontend test ต้องติดตั้ง browser provider เพิ่ม หากต้องการรัน Angular tests แบบ browser

## หมายเหตุด้านความปลอดภัย

ค่า username/password ในไฟล์ configuration เป็นค่า development เท่านั้น ควรเปลี่ยนก่อนใช้งานจริง และควรใช้ HTTPS, secret management, validation ที่เข้มงวด และระบบ authentication ที่เหมาะกับ production
