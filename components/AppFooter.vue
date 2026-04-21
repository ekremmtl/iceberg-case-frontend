<template>
  <footer
    class="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-black text-white text-xs"
  >
    <span>© 2026 Mustafa Ekrem Mutlu</span>

    <div class="flex items-center gap-3 flex-wrap">
      <a
        href="https://www.linkedin.com/in/ekrem-mutlu"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary transition-colors"
      >
        <Linkedin class="w-4 h-4" />
      </a>

      <a
        href="https://github.com/ekremmtl/iceberg-case-frontend"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary transition-colors"
      >
        <CodeXml class="w-4 h-4" />
      </a>

      <a
        href="https://github.com/ekremmtl/iceberg-case-backend"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary transition-colors"
      >
        <Database class="w-4 h-4" />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Linkedin, CodeXml, Database } from "lucide-vue-next";
</script>
