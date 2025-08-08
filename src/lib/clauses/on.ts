export interface Clause {
  id: string;
  title: string;
  body: string;
  mandatory?: boolean;
}

export const ONTARIO_CLAUSES: Clause[] = [
  {
    id: "act-prevails",
    title: "Act Prevails",
    body: "If any term of this agreement conflicts with the Residential Tenancies Act, 2006 (Ontario) or its regulations, the Act prevails.",
    mandatory: true,
  },
  {
    id: "human-rights",
    title: "Human Rights and Service Animals",
    body: "The parties acknowledge obligations under the Ontario Human Rights Code. Service animals are not pets and must be accommodated.",
    mandatory: true,
  },
  {
    id: "repairs",
    title: "Repairs and Maintenance",
    body: "The landlord is responsible for keeping the rental unit in a good state of repair and complying with health, safety, housing and maintenance standards. The tenant must keep the unit reasonably clean and repair damage they or their guests cause, beyond normal wear and tear.",
  },
  {
    id: "sublet-assignment",
    title: "Subletting and Assignment",
    body: "Subletting or assigning the tenancy requires the landlord’s consent, which shall not be unreasonably withheld, subject to the Act.",
  },
  {
    id: "deposits",
    title: "Deposits",
    body: "Security/damage deposits are not permitted. A rent deposit (typically last month’s rent) may be collected up to one month’s rent, with interest payable at the guideline rate.",
  },
];

