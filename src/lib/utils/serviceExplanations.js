export const getDetailedServiceExplanation = (provider, serviceName = null) => {
  const explanations = {
    "Easy Laundry": {
      overview:
        "Professional laundry service delivered directly to your doorstep. We handle everything from collection to washing, drying, and final delivery, giving you back precious time in your week. Our process uses **eco-friendly detergents** and **professional-grade equipment** to ensure your clothes receive the best care possible while being gentle on the environment.",

      howItWorks: `### Schedule Your Pickup
Book a collection through our app or website at your convenience. Choose a time slot that works best for you—we're available **7 days a week**, including evenings and weekends.

### We Come to You
Our professional driver arrives at your specified address with **clean, sanitized laundry bags**. We carefully collect your items, immediately sorting them by fabric type and color to prevent any mixing or damage during transport.

### Expert Processing
Your laundry is taken to our state-of-the-art facility where it undergoes a multi-step process. Each item receives **pre-treatment inspection** where stains are identified and treated with specialized solutions. We then use **temperature-controlled washing** with eco-friendly detergents followed by **gentle drying** that preserves fabric integrity and prevents shrinkage.

### Fresh Delivery
Your cleaned, folded, and neatly packed laundry is returned within **24 hours**. Items are organized by category—shirts, pants, undergarments—and packed in fresh, clean bags. We handle everything so you don't have to think about laundry again until your next scheduled pickup.`,

      serviceDetails: {
        Jacket: `### Specialized Jacket Care
We provide **professional cleaning for all jacket types** including denim, leather, winter coats, and blazers. Our process begins with **special attention to collar and cuff stains** where dirt and oils accumulate most. We use **gentle cycle washing** with temperature controls specifically calibrated for different fabrics—cool water for denim, specialized solutions for leather.

### Fabric Preservation
Each jacket receives **steam finishing** that removes wrinkles without the harsh pressure of traditional ironing, preserving the garment's shape and texture. For outdoor jackets, we offer optional **waterproofing treatments** that restore water resistance without compromising breathability. We handle delicate details like button protection during washing and special care for zippers and Velcro closures.

### Quality Assurance
Every jacket undergoes **triple-check quality control**—after washing, after drying, and before packing. Our technicians look for any remaining stains, check for proper drying, and ensure all fasteners are functioning correctly. We stand by our work with a **satisfaction guarantee**—if you're not completely happy with the results, we'll reclean the item at no additional charge.`,

        General: `### Why Choose Easy Laundry?
Our **24-hour standard turnaround** means you get your laundry back quickly, with express 12-hour service available for urgent needs. We offer **free pickup and delivery** with no order minimums—whether you need one load or ten. Our professional-grade equipment and **eco-friendly detergents** are safe for all fabrics and skin types, including baby clothing and sensitive skin.

### Specialized Expertise
We handle **delicate fabrics** like silk, wool, and cashmere with specialized cleaning methods that preserve texture and color. Our **stain removal expertise** tackles everything from coffee spills to grass stains to ink marks. We're particularly experienced with **workwear and uniforms**, understanding the importance of professional presentation and durability requirements.`,
      },

      benefits: [
        "Save 4-6 hours per week on laundry chores and errands",
        "Professional stain removal included at no extra cost",
        "Eco-friendly processes that reduce water usage by 30% compared to home washing",
        "All detergents are hypoallergenic, dermatologist-tested, and skin-safe",
        "Real-time tracking lets you monitor your laundry's progress from collection to delivery",
      ],
    },

    Wegas: {
      overview:
        "Safe, reliable LP gas cylinder exchange service delivered directly to your location. We ensure you **never run out of gas during critical moments**, whether you're cooking dinner for the family or operating a restaurant kitchen. Our certified technicians follow **strict safety protocols** with every exchange, giving you peace of mind with every delivery.",

      howItWorks: `### Place Your Order
Select your cylinder size and schedule delivery through our app or website. We support **all standard LP gas cylinder sizes** from 3kg to 48kg, with options for one-time delivery or scheduled weekly/monthly service.

### Safety First Approach
Our certified technician arrives at your location and performs a comprehensive **safety verification protocol**. This includes cylinder integrity checks, valve inspections, expiry date verification, and leak detection using professional-grade equipment. We **never compromise on safety**—if a cylinder doesn't meet our standards, we won't exchange it.

### Professional Exchange Process
The exchange follows **strict safety protocols**: empty cylinders are disconnected using proper tools and techniques, new cylinders are connected with fresh seals and tested for proper pressure. Our technicians conduct **pressure testing on-site** to ensure everything is functioning correctly before leaving your premises.

### Complete Documentation
You receive **digital documentation** including a safety certificate with cylinder serial numbers, next service reminder, and emergency contact information. We maintain detailed records of every exchange so you have complete traceability and peace of mind.`,

      serviceDetails: {
        "48 Kg LP Gas Bottle Exchange": `### Technical Specifications
The 48kg LP gas cylinder measures **400mm in diameter** with an average shoulder height of **540mm**. It contains **22kg of gas** with a tare weight of 26kg, operating at **800 kPa pressure** at 15°C. Constructed from **high-grade steel with corrosion protection**, these cylinders are built for durability and safety in demanding environments.

### Industrial Applications
This size is commonly used for **restaurant kitchen operations** where consistent, high-volume gas supply is essential. It's ideal for **industrial heating systems**, **large household water heating** installations, **commercial heating units**, and **backup power generation** systems. The 48kg cylinder provides extended operation time between exchanges, reducing frequency and increasing convenience.

### Important Safety Notes
This service is an **EXCHANGE ONLY**—you must have an exchangeable cylinder on hand. Cadac and Alva cylinders and similar non-exchange cylinders **can only be filled in-store** and are not exchangeable through our service. Cylinder colors may vary by manufacturer, but all meet the same **SABS-approved safety standards**.`,

        General: `### Compliance & Regulations
We work exclusively with **SABS-approved cylinders** that undergo regular pressure testing and certification. Our operations comply with **DOT/UN transport regulations**, environmental protection standards, and all local safety requirements. Every technician is **certified in gas handling** and undergoes regular safety training updates.

### Delivery Network
Available throughout major metropolitan areas with **same-day delivery options** for urgent needs. We offer **scheduled weekly deliveries** for businesses, **emergency delivery service** for after-hours needs, and **corporate account programs** with volume discounts and dedicated account management.`,
      },

      benefits: [
        "Every exchange handled by certified gas technicians with specialized training",
        "24/7 emergency delivery service available for urgent situations",
        "Digital tracking system maintains complete cylinder history and exchange records",
        "Regular safety inspections and pressure testing included with every cylinder",
        "Bulk discount programs and corporate accounts for frequent users",
      ],
    },

    "Clean Paws": {
      overview:
        "Mobile pet grooming service that **comes directly to your home**, eliminating the stress of car rides and unfamiliar environments for your pets. We provide **professional grooming** in the comfort of your driveway or parking area, using our fully-equipped mobile grooming van. Our approach focuses on **reducing anxiety** for pets while delivering salon-quality results.",

      howItWorks: `### Book Your Appointment
Schedule through our app, selecting your pet's size, breed, required services, preferred time slot, and any special instructions. We accommodate **anxious pets, senior animals, and first-time grooming experiences** with special handling techniques.

### Mobile Facility Arrival
Our **fully-equipped grooming van** arrives at your location, containing a professional-grade bathing station, temperature-controlled water system, grooming table with non-slip surface, quiet drying system, and fully sanitized equipment. Everything is contained within the van—no mess in your home or yard.

### Gentle Grooming Process
We begin with a **health check and coat assessment** to identify any skin issues or special needs. The process includes gentle brushing and de-matting, warm water bath with pH-balanced shampoo specifically formulated for pets, conditioning treatment for coat health, professional drying with low-heat systems, nail trimming with quick avoidance techniques, and ear cleaning with veterinary-approved solutions.

### Post-Service Care
We share any **health observations** with you as the owner—things we noticed about skin condition, ears, teeth, or overall wellbeing. We help schedule the **next appropriate appointment** based on your pet's coat type and growth rate, and provide grooming maintenance tips to keep your pet looking great between visits.`,

      serviceDetails: {
        "Small Pet": `### Complete Small Pet Service
Our Small Pet grooming includes **warm water wash** with temperature controls specifically for small animals, **conditioning treatment** that detangles and nourishes the coat, **gentle brushing** to remove loose hair and prevent matting, **hygiene trim** for sanitary areas, face, and paw pads (upon request), **teeth brushing** with pet-safe toothpaste, **precision nail clipping** with quick avoidance techniques, **low-heat blow drying** using quiet equipment, and our **signature treatment** with a fresh bandana and light pet cologne.

### Breed Specialization
We're experienced with **toy breeds** like Chihuahuas and Pomeranians, **small breeds** including Dachshunds and Shih Tzus, **kittens and small cats**, and even **rabbits and other small animals**. Each species receives specialized handling techniques and equipment appropriate for their size and temperament.

### Special Considerations
We provide **gentle handling for senior pets** with arthritis or mobility issues, **introductory sessions for puppies and kittens** to create positive grooming associations, **calming techniques for anxious pets** including pheromone sprays and gradual exposure, and **accommodation for special medical needs** like post-surgical care or skin conditions.`,

        General: `### Advantages of Mobile Grooming
Mobile grooming significantly **reduces stress** for pets by eliminating car rides to unfamiliar places and waiting in crowded facilities. Your pet receives **one-on-one attention** throughout the entire process without exposure to other animals. Our **individual equipment sanitization** between each pet prevents cross-contamination and disease transmission.

### Health & Safety Priority
We maintain **strict sanitation protocols**—all equipment is sanitized between pets, towels and bedding are laundered after each use, and the entire van receives deep cleaning daily. Having the **owner immediately available** allows us to consult on any concerns and ensures quick response to any emergency situations.`,
      },

      benefits: [
        "Eliminates transportation stress—no car rides to unfamiliar locations",
        "One-on-one attention throughout the entire grooming session",
        "Equipment is fully sanitized between each and every pet",
        "We use professional-grade grooming products specifically formulated for pets",
        "Flexible scheduling that works around your day, not limited to salon hours",
      ],
    },

    Modern8: {
      overview:
        "Professional deep cleaning services that **restore your belongings to like-new condition** using advanced cleaning technology and certified techniques. We specialize in items that require **specialized care and handling**—rugs, upholstery, mattresses, and other furnishings that regular cleaning methods can't properly address. Our IICRC-certified technicians bring **industrial-grade equipment** to tackle even the toughest cleaning challenges.",

      howItWorks: `### Assessment & Quoting
We begin with a comprehensive **item assessment** to determine fabric/material type, identify stain types and severity, select appropriate cleaning methods, and provide an accurate turnaround estimate. Our quotes are **transparent with no hidden fees**—you know exactly what you're paying for upfront.

### Professional Collection
Items are **protective wrapped for transport** to prevent damage during movement. We use **climate-controlled vehicles** that maintain proper temperature and humidity levels. Each item receives **secure handling procedures** with digital tracking from pickup to return.

### Advanced Cleaning Process
At our specialized facility, items undergo **pre-inspection and tagging**, **stain pre-treatment** with targeted solutions, **advanced extraction cleaning** that lifts dirt from deep within fibers, **antimicrobial treatment** to eliminate bacteria and allergens, **professional deodorization**, and **rigorous quality control inspection** before release.

### Return & Setup
Cleaned items are returned on the scheduled date with **professional placement assistance**—we'll help position heavy rugs or furniture. We conduct a **final inspection with you** to ensure complete satisfaction and provide **maintenance tips** to extend cleanliness between professional cleanings.`,

      serviceDetails: {
        Rug: `### Rug Cleaning Expertise
Our rug cleaning begins with **comprehensive pre-inspection**: fiber type identification, dye stability testing, structural integrity checks, and detailed stain analysis. We then apply **targeted pre-treatment** including soil suspension applications, specialized stain treatments, fringe protection measures, and edge reinforcement where needed.

### Size-Based Pricing
**Small rugs (160cm × 230cm)** at R599 are perfect for entryways, bathrooms, or in front of sinks. **Medium rugs (200cm × 300cm)** at R799 work beautifully as living room centerpieces or under dining tables. **Large rugs (240cm × 340cm)** at R999 make impressive statements in dining rooms or large living spaces.

### Specialized Handling
We have particular expertise with **Oriental and Persian rugs** requiring delicate handling, **wool and silk blends** needing specialized cleaning solutions, **synthetic fibers** with different cleaning requirements, and **antique rug preservation** where historical integrity must be maintained alongside cleanliness.`,

        General: `### Technology & Certification
We employ **truck-mounted extraction units** that provide more power than portable systems, **HEPA filtration systems** that capture microscopic allergens, **low-moisture cleaning methods** that reduce drying time and prevent mold growth, and **eco-friendly cleaning solutions** safe for families and pets.

### Quality Standards
All technicians hold **IICRC certifications** in specific cleaning categories. We follow **manufacturer method compliance** to preserve warranties, offer **colorfastness guarantees** on all cleaned items, and provide **odor elimination warranties** for persistent smells. Our processes meet the highest industry standards for safety and effectiveness.`,
      },

      benefits: [
        "Every technician is IICRC-certified with specialized training in different cleaning categories",
        "We use advanced stain removal technology that tackles even set-in, old stains",
        "Our eco-friendly cleaning solutions are effective yet safe for families and pets",
        "Allergy-reducing treatments remove dust mites, pet dander, and other common allergens",
        "Convenient pickup and delivery means you don't have to transport bulky items yourself",
      ],
    },
  };

  // Return provider explanation with service-specific details if available
  if (!provider || !explanations[provider]) {
    return {
      overview:
        "Professional service delivered with care and attention to detail. Our team of experts ensures quality results with every booking.",
      howItWorks: "",
      benefits: [],
      specificServiceDetail: null,
    };
  }

  const providerData = explanations[provider];

  return {
    overview: providerData.overview,
    howItWorks: providerData.howItWorks,
    benefits: providerData.benefits,
    specificServiceDetail:
      serviceName && providerData.serviceDetails?.[serviceName]
        ? providerData.serviceDetails[serviceName]
        : providerData.serviceDetails?.General || null,
  };
};
