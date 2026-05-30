# AffordabilityIQ by Hart — Chatbot Training Guide
### How to Use This Application

---

## ABOUT THIS TOOL

**AffordabilityIQ** is a free home affordability calculator built by Kelvin Hart, Realtor at Fathom Realty Indiana. It helps homebuyers — whether renting or already owning — figure out exactly how much home they can afford based on a monthly payment they're comfortable with, then search real active listings that match their budget.

**Live URL:** https://AffordabilityIQ.Hart-IQ.com
**Built for:** First-time buyers, repeat homebuyers, investors, and new construction clients
**Agent:** Kelvin Hart | Fathom Realty Indiana | Noblesville, IN
**Phone:** (317) 833-8419
**Email:** khart@fathomrealty.com
**Website:** https://kelvinhart.fathomrealty.com

---

## WHO THIS TOOL IS FOR

| Visitor Type | How the Tool Helps |
|---|---|
| **First-Time Buyer** | Figures out a realistic purchase price from a comfortable monthly payment |
| **Current Homeowner** | Calculates net equity from their current home and applies it toward an upgrade |
| **Renter** | Skips the equity step and goes straight to affordability and listing search |
| **Investor** | Gets a quick purchase price estimate to evaluate deal potential |
| **New Construction Buyer** | Uses the estimate as a baseline before exploring builder pricing |

---

## HOW THE TOOL WORKS — STEP BY STEP

The tool walks users through a simple 4–5 step wizard. Here is what each step does and what the chatbot should know about it.

---

### STEP 1 — What's Your Current Situation?

The user selects one of two options:

- **I Own a Home** — adds an extra step to calculate net equity from their current property
- **I'm Renting** — skips equity and goes straight to financing preferences

**Chatbot tip:** If a visitor seems unsure which to pick, ask them: *"Do you currently own a home, or are you renting?"* Then guide them to the matching option.

---

### STEP 2 — Ideal Total Monthly Payment?

The user sets their comfortable all-in monthly housing budget using a slider or by typing a specific dollar amount.

**What this number means:**
This is their total PITI budget — Principal, Interest, Taxes, and Insurance combined. It is NOT just the mortgage payment. The tool automatically separates taxes and insurance (estimated at 1.1% of the home price per year) from the principal and interest to calculate the true loan amount they can support.

**Range available:** $500 – $20,000/month
**Default starting value:** $2,000/month

**Chatbot tip:** If a visitor asks "what should I put here?" — tell them to think about the total amount they want to spend on housing each month, including taxes and insurance, not just the mortgage payment. A good starting point is roughly 28–30% of their gross monthly income, though this tool lets them decide what feels comfortable.

---

### STEP 3 — About Your Current Home (Homeowners Only)

This step only appears for users who selected "I Own a Home."

The user enters:
- **Estimated Current Home Value** — what they think their home is worth today
- **Remaining Mortgage Balance** — what they still owe on it

**What the tool calculates:**
Net Equity = (Home Value − Mortgage Balance) − 7% selling costs

The 7% accounts for typical selling costs like agent commissions, closing costs, and fees. This gives a realistic picture of cash available for the next purchase.

**Example:**
- Home Value: $350,000
- Mortgage Balance: $200,000
- Gross Equity: $150,000
- Selling Costs (7%): − $24,500
- **Net Equity: $125,500**

**Chatbot tip:** If a visitor doesn't know their home value, suggest they check Zillow or Redfin for a rough estimate, or offer to have Kelvin run a free Comparative Market Analysis (CMA) for them.

---

### STEP 4 — Financing Preferences

The user fine-tunes two assumptions that affect their purchase price estimate:

**Down Payment** (slider from 3% to 30%)
- 3% = FHA loan minimum
- 5–10% = Conventional with PMI
- 20%+ = Conventional without PMI
- Default: 10%

**Interest Rate** (slider from 4% to 12%)
- Default: 7.0%
- Users should enter the current rate they've been quoted, or use the default as a market approximation

**Chatbot tip:** If a visitor asks what interest rate to use — suggest they check with their lender or use the current market average. If they haven't spoken to a lender yet, Kelvin can connect them with trusted mortgage partners.

---

### STEP 5 — Contact Information

The user enters their name, email, and optionally their phone number to unlock their personalized results.

**Fields:**
- First Name (required)
- Last Name (required)
- Email Address (required)
- Phone Number (optional)

**What happens after submission:**
1. Results are displayed immediately on screen
2. A lead record is automatically created in Kelvin's CRM (Airtable)
3. The user can email themselves a copy of their results

**Privacy note:** Information is only used by Kelvin Hart for follow-up. It is never sold or shared with third parties.

**Chatbot tip:** If a visitor is hesitant to share their info — reassure them that Kelvin personally reviews every submission and only reaches out if they want him to. There is no automated spam.

---

## THE RESULTS PAGE

After submitting contact info, the user sees their personalized affordability results. Here is what each section means:

### Estimated Maximum Purchase Price
The headline number — the highest home price they can afford based on their monthly budget, down payment, and interest rate. This is a starting point, not a guarantee.

### Monthly Payment Breakdown (PITI)
Shows how their budget is split:
- **Principal & Interest (P&I)** — the actual loan payment
- **Taxes & Insurance (est. 1.1%/yr)** — the estimated reserve held back
- **Total Monthly PITI Budget** — what they entered in Step 2

### Metric Cards
Quick summary of:
- Loan Amount
- Down Payment required
- Net Equity (homeowners only)
- Monthly PITI Budget

### Net Equity Analysis (Homeowners Only)
Shows the full math of how net equity was calculated so the user understands exactly what they'd walk away with after selling.

### Equity Alerts
- ✅ **Green alert** — Net equity covers the down payment with surplus remaining. User is well-positioned to upgrade.
- ⚠️ **Yellow/Red alert** — Equity gap exists. Net equity falls short of the required down payment. Kelvin can help evaluate options.
- ⚠️ **Negative equity alert** — After selling costs the user would be upside-down. Kelvin can discuss alternatives.

### Email Results Button
Sends a full summary of the results to the user's email address AND to Kelvin Hart for follow-up. If the user has also searched for listings, those are included in the email.

---

## PROPERTY SEARCH FEATURE

After viewing results, users can optionally search for real active MLS listings that match their budget.

**How to use it:**
1. Enter a 5-digit Indiana zip code (e.g. 46060 for Noblesville)
2. Select minimum bedrooms (1+ through 5+)
3. Select minimum bathrooms (1+ through 3+)
4. Click **Find My Next-Level Living Space**

**What it searches:**
Active for-sale listings within $75,000 below the user's estimated maximum purchase price, up to their maximum. Results pull from the RentCast API and show up to 6 matching properties.

**Clicking a listing:**
Copies the property address to the clipboard and opens KelvinHart.fathomrealty.com so the user can search for the full listing details there.

**Chatbot tip:** If a visitor asks what zip codes to use — here are common Indiana zip codes in the Noblesville/Hamilton County area:
- Noblesville: 46060, 46062
- Fishers: 46037, 46038
- Carmel: 46032, 46033
- Westfield: 46074
- Zionsville: 46077

---

## COMMON VISITOR QUESTIONS & CHATBOT RESPONSES

**Q: Is this tool free to use?**
A: Yes, completely free. No account required.

**Q: How accurate is the purchase price estimate?**
A: It's a solid educational starting point based on your inputs. Actual loan approval depends on your credit score, debt-to-income ratio, employment history, and lender underwriting. Think of it as a confident ballpark — not a pre-approval.

**Q: Do I need to be pre-approved before using this?**
A: No. This tool is designed to help you figure out where to start. Once you have your estimate, Kelvin can connect you with trusted lenders to get pre-approved.

**Q: What is PITI?**
A: PITI stands for Principal, Interest, Taxes, and Insurance — the four components that make up a full monthly mortgage payment. The tool asks for your total comfortable PITI budget and works backward from there.

**Q: What does "net equity" mean?**
A: Net equity is the cash you'd realistically walk away with after selling your current home — after paying off your mortgage and covering selling costs (agent commissions, closing costs, etc., estimated at 7%).

**Q: Can I use my equity as a down payment?**
A: Yes — and the tool shows you whether your net equity covers the down payment on your next home. If there's a gap, Kelvin can help you evaluate bridge loans, contingency offers, and other strategies.

**Q: What if the property search shows no results?**
A: Try adjusting the zip code or lowering the minimum bedroom/bathroom requirements. You can also visit KelvinHart.fathomrealty.com directly to browse all active listings.

**Q: Can I start over?**
A: Yes — there's a "Start Over" button on the results page that resets everything.

**Q: Is my information shared with anyone?**
A: Your information goes only to Kelvin Hart for follow-up. It is not sold or shared with any third parties.

**Q: I'm not ready to buy yet — should I still use this?**
A: Absolutely. Knowing your number now helps you plan, save, and make smarter decisions over the next 6–12 months. Kelvin is happy to have a no-pressure conversation whenever you're ready.

**Q: How do I contact Kelvin directly?**
A: Call or text: **(317) 833-8419** | Email: **khart@fathomrealty.com** | Website: **kelvinhart.fathomrealty.com**

---

## CHATBOT CONVERSATION STARTERS

Use these to proactively engage visitors:

- *"Are you currently renting or do you own a home? I can walk you through exactly how this tool works for your situation."*
- *"Do you know what monthly payment you'd be comfortable with? That's the first number we need to get your estimate."*
- *"Have you talked to a lender yet? If not, this tool is a great first step before you do."*
- *"Are you thinking about buying in the Noblesville area? I can help you search active listings once you have your estimate."*
- *"Not sure where to start? Just click 'Start the Estimate' and I'll guide you through each step."*

---

## DISCLAIMER

AffordabilityIQ is designed to provide a high-level estimate of buying power based on the information you provide. Results are for informational purposes only and do not constitute financial, mortgage, or real estate advice. Actual qualification amounts may vary based on lender guidelines, current interest rates, property taxes, insurance costs, HOA fees, and your individual financial profile. Always consult with a licensed mortgage or financial professional before making any lending or purchasing decisions.

---

*Document prepared for chatbot training — AffordabilityIQ by Hart | Last updated May 2026*
