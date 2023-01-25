<script setup>
import { setupApolloProviders } from '@/config/api/apollo-providers.js';

setupApolloProviders();

defineProps(['component']);
</script>

<template>
    <component :is="component" />
</template>
