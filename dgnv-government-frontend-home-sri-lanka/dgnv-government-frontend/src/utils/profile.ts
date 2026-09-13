import type { CitizenProfile, OfficerProfile } from "../types/platform";

export const findCitizenByEmail = (citizens: CitizenProfile[], email: string) =>
  citizens.find((citizen) => citizen.email?.toLowerCase() === email.toLowerCase());

export const findOfficerByEmail = (officers: OfficerProfile[], email: string) =>
  officers.find((officer) => officer.email.toLowerCase() === email.toLowerCase());
