<template>
    <div class="designer-datasource-list">
        <h3>{{ selectedMenu.title }}</h3>
        <ul></ul>
    </div>
</template>
<script setup lang="ts">
import { useLeftMenuStore } from 'tdp-editor-utils/stores/leftMenuStore';
const leftMenuStore = useLeftMenuStore();
const selectedMenu = leftMenuStore.selectedMenu!;
</script>
