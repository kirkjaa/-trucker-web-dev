# 🔐 Trucker Web & Mobile - Login Credentials

> **All demo users use the same password: `Demo@123`**

---

## 📋 Complete Login Credentials

### 🔐 SUPERADMIN (Admin Role)

| Username/Email | Password | Notes |
|----------------|----------|-------|
| `superadmin@demo.com` | `Demo@123` | Full system admin access |

---

### 🏭 ORGANIZATION - Factory Users

| Username/Email | Password | Notes |
|----------------|----------|-------|
| `factory@demo.com` | `Demo@123` | Factory 1 Manager |
| `factory2@demo.com` | `Demo@123` | Factory 2 Manager |
| `factory.user.001@trucker.demo` | `Demo@123` | Factory Staff |
| `factory.user.002@trucker.demo` | `Demo@123` | Factory Staff |
| `factory.user.003@trucker.demo` | `Demo@123` | Factory Staff |
| ... (up to ~40 factory users) | `Demo@123` | Pattern: `factory.user.XXX@trucker.demo` |

---

### 🏢 ORGANIZATION - Company Users

| Username/Email | Password | Notes |
|----------------|----------|-------|
| `company@demo.com` | `Demo@123` | Company 1 Manager |
| `company2@demo.com` | `Demo@123` | Company 2 Manager |
| `company.user.001@trucker.demo` | `Demo@123` | Company Staff |
| `company.user.002@trucker.demo` | `Demo@123` | Company Staff |
| `company.user.003@trucker.demo` | `Demo@123` | Company Staff |
| ... (up to ~36 company users) | `Demo@123` | Pattern: `company.user.XXX@trucker.demo` |

---

### 🚚 DRIVER Users (Main Mobile App Role)

#### General Drivers
| Username/Email | Password | Type | Status |
|----------------|----------|------|--------|
| `driver@demo.com` | `Demo@123` | General | ACTIVE |
| `driver.internal@demo.com` | `Demo@123` | Internal | ACTIVE |
| `driver.freelance@demo.com` | `Demo@123` | Freelance | ACTIVE |

#### Internal Drivers (20 users)
| Username/Email | Password | Status |
|----------------|----------|--------|
| `driver.internal.1@trucker.demo` | `Demo@123` | ACTIVE |
| `driver.internal.2@trucker.demo` | `Demo@123` | ACTIVE |
| `driver.internal.3@trucker.demo` | `Demo@123` | ACTIVE |
| `driver.internal.4@trucker.demo` | `Demo@123` | ACTIVE |
| `driver.internal.5@trucker.demo` | `Demo@123` | ACTIVE |
| ... | `Demo@123` | ACTIVE |
| `driver.internal.20@trucker.demo` | `Demo@123` | ACTIVE |

#### Freelance Approved Drivers (20 users)
| Username/Email | Password | Status |
|----------------|----------|--------|
| `driver.freelance.1@trucker.demo` | `Demo@123` | ACTIVE |
| `driver.freelance.2@trucker.demo` | `Demo@123` | ACTIVE |
| `driver.freelance.3@trucker.demo` | `Demo@123` | ACTIVE |
| `driver.freelance.4@trucker.demo` | `Demo@123` | ACTIVE |
| `driver.freelance.5@trucker.demo` | `Demo@123` | ACTIVE |
| ... | `Demo@123` | ACTIVE |
| `driver.freelance.20@trucker.demo` | `Demo@123` | ACTIVE |

#### Freelance Pending Drivers (10 users - for review testing)
| Username/Email | Password | Status |
|----------------|----------|--------|
| `driver.pending.1@trucker.demo` | `Demo@123` | PENDING |
| `driver.pending.2@trucker.demo` | `Demo@123` | PENDING |
| `driver.pending.3@trucker.demo` | `Demo@123` | PENDING |
| ... | `Demo@123` | PENDING |
| `driver.pending.10@trucker.demo` | `Demo@123` | PENDING |

---

## 🎯 Quick Reference - Recommended Test Accounts

| Role | Desktop | Mobile | Email | Password |
|------|:-------:|:------:|-------|----------|
| **Admin** | ✅ | ✅ | `superadmin@demo.com` | `Demo@123` |
| **Factory** | ✅ | ✅ | `factory@demo.com` | `Demo@123` |
| **Company** | ✅ | ✅ | `company@demo.com` | `Demo@123` |
| **Driver** | ✅ | ✅ | `driver@demo.com` | `Demo@123` |
| **Internal Driver** | ✅ | ✅ | `driver.internal.1@trucker.demo` | `Demo@123` |
| **Freelance Driver** | ✅ | ✅ | `driver.freelance.1@trucker.demo` | `Demo@123` |

---

## 📱 Mobile App Role Mapping

The mobile app maps desktop roles to mobile-friendly role names:

| Desktop Role | Mobile Role | Best For |
|--------------|-------------|----------|
| `SUPERADMIN` | `admin` | Admin dashboard, full system access |
| `ORGANIZATION` | `company` | Factory/Company management |
| `DRIVER` | `shipping` | **Main mobile use case** - Jobs, deliveries, navigation |

---

## 🌐 Application URLs

| Application | URL |
|-------------|-----|
| **Desktop Web** | https://trw.q9.quest |
| **Mobile Web** | https://m.trw.q9.quest |
| **API** | https://api.trw.q9.quest |

---

## 🌍 Language Support

Both applications support 3 languages:
- 🇹🇭 **Thai** (ไทย) - Default
- 🇺🇸 **English**
- 🇰🇷 **Korean** (한국어)

Language can be switched from:
- **Desktop**: Sidebar language switcher
- **Mobile**: Login screen (top right) or Settings > Language

---

## ⚠️ Important Notes

1. **Password for ALL demo accounts**: `Demo@123`
2. **PENDING users** cannot login until approved by admin
3. **Mobile app** is optimized for DRIVER role (`shipping`)
4. Both apps share the **same database** - changes reflect on both platforms
5. For testing different user flows, use the recommended accounts above

---

## 📊 User Count Summary

| Role | Count | Notes |
|------|-------|-------|
| SUPERADMIN | 1 | System administrator |
| Factory Managers | 2 | `factory@demo.com`, `factory2@demo.com` |
| Factory Staff | ~40 | Pattern: `factory.user.XXX@trucker.demo` |
| Company Managers | 2 | `company@demo.com`, `company2@demo.com` |
| Company Staff | ~36 | Pattern: `company.user.XXX@trucker.demo` |
| Internal Drivers | 20+ | Pattern: `driver.internal.X@trucker.demo` |
| Freelance Drivers (Active) | 20+ | Pattern: `driver.freelance.X@trucker.demo` |
| Freelance Drivers (Pending) | 10 | Pattern: `driver.pending.X@trucker.demo` |
| **Total** | **~130+** | |

---

*Last updated: December 2024*

