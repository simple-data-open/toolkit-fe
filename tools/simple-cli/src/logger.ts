import kleur from 'kleur';

export function logger(...message: string[]) {
  console.log(kleur.gray('[Simple CLI]'), ...message);
}
