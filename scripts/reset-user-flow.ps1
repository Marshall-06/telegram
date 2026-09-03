# Kullanici onboarding/dil akisini sifirlar (test icin)
param(
  [Parameter(Mandatory = $true)]
  [string]$TelegramId
)

Set-Location (Join-Path $PSScriptRoot "..")

node --input-type=module -e @"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const telegramId = BigInt('$TelegramId');

const user = await prisma.user.update({
  where: { telegramId },
  data: {
    languageConfirmed: false,
    onboardingCompleted: false,
  },
});

console.log('Sifirlandi:', {
  telegramId: user.telegramId.toString(),
  language: user.language,
  languageConfirmed: user.languageConfirmed,
  onboardingCompleted: user.onboardingCompleted,
});

await prisma.`$disconnect();
"@
