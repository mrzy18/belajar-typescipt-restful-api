import type { addresses } from '@prisma/client';

export type AddressResponse = {
  id: number;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode: string;
};

export type CreateAddressRequest = {
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode: string;
  contactId: number;
};

export type UpdateAddressRequest = {
  id: number;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode: string;
  contactId: number;
};

export type GetAddressRequest = {
  id: number;
  contactId: number;
};

export type RemoveAddressRequest = GetAddressRequest;

export function toAddressResponse(address: addresses): AddressResponse {
  return {
    id: address.id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postalCode: address.postalCode,
  };
}
