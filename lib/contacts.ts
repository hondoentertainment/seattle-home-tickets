export type ContactLink = {
  label: string;
  href: string;
};

export type ContactGroup = {
  heading: string;
  note?: string;
  entries: {
    name: string;
    links: ContactLink[];
  }[];
};

/** Official published pages only — no invented emails, phones, or forms. */
export const contactGroups: ContactGroup[] = [
  {
    heading: "Pro clubs",
    note: "Ticket offices and guest-services pages published by the clubs.",
    entries: [
      {
        name: "Seattle Mariners",
        links: [
          { label: "Tickets", href: "https://www.mlb.com/mariners/tickets" },
          { label: "Contact the Mariners", href: "https://www.mlb.com/mariners/official-information/contact" },
          { label: "Guest experience", href: "https://www.mlb.com/mariners/ballpark/guest-services" },
        ],
      },
      {
        name: "Seattle Seahawks",
        links: [
          { label: "Tickets", href: "https://www.seahawks.com/tickets/" },
          { label: "Contact us", href: "https://www.seahawks.com/about/contact-us/" },
          { label: "Ticket policies", href: "https://www.seahawks.com/tickets/policies/" },
        ],
      },
      {
        name: "Seattle Kraken",
        links: [
          { label: "Tickets", href: "https://www.nhl.com/kraken/tickets" },
          { label: "Contact us", href: "https://www.nhl.com/kraken/team/contact-us" },
        ],
      },
      {
        name: "Seattle Sounders FC",
        links: [
          { label: "Tickets", href: "https://www.soundersfc.com/tickets" },
          { label: "Ticket information request", href: "https://www.soundersfc.com/tickets/information-request" },
        ],
      },
      {
        name: "Seattle Reign FC",
        links: [
          { label: "Single-match tickets", href: "https://www.reignfc.com/tickets/single-match-tickets" },
        ],
      },
      {
        name: "Seattle Storm",
        links: [
          { label: "Ticket Central", href: "https://storm.wnba.com/tickets" },
          { label: "Contact", href: "https://storm.wnba.com/contact" },
        ],
      },
      {
        name: "Seattle Torrent (PWHL)",
        links: [
          { label: "Tickets / memberships", href: "https://www.thepwhl.com/en/teams/seattle-torrent/tickets" },
          { label: "Member FAQ (schedule)", href: "https://www.thepwhl.com/en/teams/seattle-torrent/tickets/member-faqs" },
        ],
      },
    ],
  },
  {
    heading: "College programs",
    entries: [
      {
        name: "Washington Huskies",
        links: [
          { label: "Tickets home", href: "https://gohuskies.com/tickets" },
          { label: "Husky Ticket Office", href: "https://gohuskies.com/sports/2026/7/2/tickets" },
        ],
      },
      {
        name: "Seattle U Redhawks",
        links: [{ label: "Tickets", href: "https://goseattleu.com/tickets" }],
      },
      {
        name: "Seattle Pacific Falcons",
        links: [
          {
            label: "Athletics ticket page",
            href: "https://spufalcons.com/sports/2026/8/6/spu-athletics-ticket-page.aspx",
          },
        ],
      },
    ],
  },
  {
    heading: "High schools",
    note: "Metro / KingCo box offices vary by school. Public-school football is typically digital via Seattle Public Schools.",
    entries: [
      {
        name: "O'Dea Fighting Irish",
        links: [{ label: "Football schedule / athletics", href: "https://www.odea.org/athletics/fall-sports/football/" }],
      },
      {
        name: "Ballard Beavers",
        links: [
          { label: "Athletics", href: "https://ballardhs.seattleschools.org/activities/athletics/" },
          { label: "SPS digital athletic tickets", href: "https://www.seattleschools.org/news/digital-athletic-tickets/" },
        ],
      },
      {
        name: "Roosevelt Roughriders",
        links: [
          { label: "SPS digital athletic tickets", href: "https://www.seattleschools.org/news/digital-athletic-tickets/" },
        ],
      },
      {
        name: "Rainier Beach Vikings",
        links: [
          { label: "SPS digital athletic tickets", href: "https://www.seattleschools.org/news/digital-athletic-tickets/" },
        ],
      },
      {
        name: "Eastside Catholic Crusaders",
        links: [{ label: "Football / athletics", href: "https://www.eastsidecatholic.org/athletics/teams/football" }],
      },
      {
        name: "Bellevue Wolverines",
        links: [
          { label: "MaxPreps football (published dates)", href: "https://www.maxpreps.com/wa/bellevue/bellevue-wolverines/football/" },
        ],
      },
    ],
  },
  {
    heading: "Venues",
    entries: [
      {
        name: "T-Mobile Park",
        links: [{ label: "Guest experience", href: "https://www.mlb.com/mariners/ballpark/guest-services" }],
      },
      {
        name: "Lumen Field",
        links: [{ label: "Lumen Field events", href: "https://www.lumenfield.com/" }],
      },
      {
        name: "Climate Pledge Arena",
        links: [{ label: "Tickets / plan your visit", href: "https://climatepledgearena.com/tickets/" }],
      },
    ],
  },
];
