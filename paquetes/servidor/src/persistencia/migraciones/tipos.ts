// Una migracion versionada y reversible (ficha T-060 §7): `bajar` deshace exactamente `subir`.
export interface Migracion {
  readonly version: number;
  readonly nombre: string;
  readonly subir: readonly string[];
  readonly bajar: readonly string[];
}
