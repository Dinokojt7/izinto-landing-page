export const getProviderExplanation = (provider) => {
  const explanations = {
    "Easy Laundry":
      "We collect, wash, dry, pack, and deliver all your laundry, blankets, and sneaker items.",
    Wegas:
      "We come to you for the exchange. You will need an exchange cylinder in order to swop with us.",
    "Clean Paws":
      "Professional pet grooming with warm water wash and conditioning for your furry friends. We come to you!",
    Modern8:
      "Deep cleaning services for your home items, and your property ensuring every corner sparkles and shines.",
  };

  return (
    explanations[provider] ||
    "Professional service delivered with care and attention to detail."
  );
};

export const getProviderColor = (provider) => {
  const colors = {
    "Easy Laundry": "bg-[#28694B]",
    Wegas: "bg-[#C35627]",
    "Clean Paws": "bg-[#D8226C]",
    Modern8: "bg-[#744B93]",
  };
  return colors[provider] || "bg-gray-600";
};

export const getProviderImage = (provider) => {
  const images = {
    "Easy Laundry": "/images/onboard_wash.jpg",
    Wegas: "/images/onboard_wash2.jpg",
    "Clean Paws": "/images/onboard_wash1.jpg",
    Modern8: "/images/onboarding-wash2.png",
  };
  return images[provider] || "/images/default-service.jpg";
};

export const getProviderHeader = (provider) => {
  const headers = {
    "Easy Laundry": "Easy Laundry's dark-store laundry services.",
    Wegas: "Wegas's LPG gas cylinder exchange service.",
    Modern8: "Modern8's individual items and home clean.",
    "Clean Paws": "Clean Paws's professional mobile pet grooming.",
  };
  return headers[provider] || `${provider}'s professional services.`;
};

export const getProviderDetails = (provider, details) => {
  // Convert details to consistent format with null safety
  const formattedDetails = (details || []).map((detail) => {
    if (typeof detail === "object") {
      const key = Object.keys(detail)[0];
      const value = detail[key];
      return { key, value };
    }
    return { key: detail, value: "" };
  });

  // Return first 2 details + fixed service details
  const firstTwoDetails = formattedDetails.slice(0, 2);

  // Add fixed service details
  const fixedDetails = [
    {
      key: "Fastest Service",
      value: "Arrive in as fast as 45 minutes",
    },
    {
      key: "Best Value",
      value: "No markups or service fees",
    },
  ];

  return [...firstTwoDetails, ...fixedDetails];
};
