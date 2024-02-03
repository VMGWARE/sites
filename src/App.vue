<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title> VMG Ware Sites </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- This pushes the search field to the right -->
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        v-model="search"
      ></v-text-field>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-data-table
          :headers="headers"
          :items="filteredSites"
          class="elevation-1"
        >
          <template #item.domain="{ item }">
            <a :href="'https://' + item.domain" target="_blank">{{
              item.domain
            }}</a>
          </template>
          <template #item.logo="{ item }">
            <img :src="item.logo" alt="Logo" width="32" />
          </template>
        </v-data-table>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const sites = ref([
  // vmgware.dev
  {
    domain: "vmgware.dev",
    description: "The official website of VMG Ware",
    logo: "data:image/png;base64,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",
  },
  // yasifys.vmgware.dev
  {
    domain: "yasifys.vmgware.dev",
    description:
      "A user-friendly website offering a fast and reliable tool for downloading videos from popular platforms like YouTube and TikTok, supporting various formats and resolutions for convenient offline viewing.",
    logo: "https://yasifys.vmgware.dev/favicon/android-chrome-512x512.png",
  },
  // answer.vmgware.dev
  {
    domain: "answer.vmgware.dev",
    description: "Apache Answer | Free Open-source Q&A Platform",
    logo: "https://answer.vmgware.dev/uploads/branding/54Dpo8yn3G1.png",
  },
  // notes.vmgware.dev
  {
    domain: "notes.vmgware.dev",
    description: "Codimd | Realtime collaborative markdown notes",
    logo: "https://notes.vmgware.dev/favicon.png",
  },
  // project.vmgware.dev
  {
    domain: "project.vmgware.dev",
    description: "OpenProject | Open source project management software",
    logo: "https://project.vmgware.dev/assets/apple-touch-icon-120x120-7cc127b22515cb03208e0cd2ab29c30545d6c1d232a8d68058c751bf29626354.png",
  },
  // echoes.vmgware.dev
  {
    domain: "echoes.vmgware.dev",
    description:
      "Container Echoes | An efficient, real-time Docker log management tool.",
    logo: "https://echoes.vmgware.dev/favicons/android-chrome-192x192.png",
  },
  // sonar.vmgware.dev
  {
    domain: "sonar.vmgware.dev",
    description: "SonarQube | Continuous Code Quality",
    logo: "data:image/png;base64,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",
  },
  // harbor.vmgware.dev
  {
    domain: "harbor.vmgware.dev",
    description:
      "Harbor | An open source trusted cloud native registry project",
    logo: "https://goharbor.io/img/logos/harbor-horizontal-color.png",
  },
  // wiki.vmgware.dev
  {
    domain: "wiki.vmgware.dev",
    description: "Wiki.js | A modern, lightweight and powerful wiki app",
    logo: "https://wiki.vmgware.dev/_assets/favicons/android-chrome-192x192.png",
  },
  // bin.vmgware.dev
  {
    domain: "bin.vmgware.dev",
    description: "Microbin | A simple, private, and secure pastebin service",
    logo: "https://microbin.eu/img/logo-square.png",
  },
  // oneclickapps.vmgware.dev
  {
    domain: "oneclickapps.vmgware.dev",
    description: "A collection of one-click apps for CapRover",
    logo: "https://caprover.com/img/logo.png",
  },
  // windmill.vmgware.dev
  {
    domain: "windmill.vmgware.dev",
    description: "Windmill | The Tailwind CSS UI Kit",
    logo: "https://windmill.vmgware.dev/logo.svg",
  },
  // analytics.vmgware.dev
  {
    domain: "analytics.vmgware.dev",
    description:
      "Matomo | The Google Analytics alternative that protects your data and your customers' privacy",
    logo: "https://analytics.vmgware.dev/misc/user/logo-header.png?matomo",
  },
  // camphouse.vmgware.dev
  {
    domain: "camphouse.vmgware.dev",
    description: "CampHouse",
    logo: "https://camphouse.vmgware.dev/img/icons/apple-touch-icon.png",
  },
  // uptime.vmgware.dev
  {
    domain: "uptime.vmgware.dev",
    description: "Uptime Kuma | A fancy self-hosted monitoring tool",
    logo: "https://uptime.vmgware.dev/icon.svg",
  },
  // mail.vmgware.dev
  {
    domain: "mail.vmgware.dev",
    description: "mailcow | mail server suite",
    logo: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAuMDAgMC4wMCAxODAuMDAgMTgwLjAwIj4KPHBhdGggc3Ryb2tlPSIjNmY3MzdhIiBzdHJva2Utd2lkdGg9IjIuMDAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJidXR0IiB2ZWN0b3ItZWZmZWN0PSJub24tc2NhbGluZy1zdHJva2UiIGQ9IgogIE0gMTQyLjk0IDgzLjQ0CiAgUSAxNDIuOTcgODMuNDYgMTQzLjAyIDgzLjQ4CiAgUSAxNDMuMjAgODMuNTMgMTQzLjI5IDgzLjI2CiAgUSAxNDUuMDcgNzcuNzUgMTQ1LjQwIDcxLjk3CiAgQSAwLjM1IDAuMzUgMC4wIDAgMCAxNDQuODYgNzEuNjYKICBRIDEzNS4yMiA3OC4xNyAxMjMuNzIgODEuMDAKICBRIDEyMy4yMyA4MS4xMSAxMjIuNzMgODEuMTMKICBRIDEyMi42NSA4MS4xMyAxMjIuNzEgODEuMjAKICBRIDEyMi44MCA4MS4zMSAxMjIuNzQgODEuNTAKICBRIDEyMi42OCA4MS43NSAxMjIuNDIgODEuNzcKICBMIDExMS4wNCA4Mi44NQogIEEgMC4zNyAwLjM3IDAuMCAwIDEgMTEwLjg2IDgyLjE1CiAgUSAxMjEuOTkgNzcuMTcgMTMyLjA4IDcwLjAzCiAgQyAxMzQuNzAgNjguMTggMTM3LjE2IDY1Ljg1IDEzOS43NCA2My43MQogIFEgMTQ2LjQ0IDU4LjEzIDE1MS43MSA1MS4yMAogIEMgMTU4LjExIDQyLjc3IDE2My4zOCAzMS41MCAxNjAuMzggMjAuMzUKICBBIDAuNDMgMC40MyAwLjAgMCAwIDE1OS42OSAyMC4xMwogIEMgMTQyLjg3IDMzLjgwIDEyNS4yOCA0Ni41MyAxMDQuNjEgNTMuODEKICBDIDc1Ljg3IDYzLjkyIDM3LjkwIDczLjQxIDIzLjY1IDEwNC4wOQogIFEgMTYuMDAgMTIwLjU0IDIxLjA2IDEzOS4wMgogIEMgMjIuMzYgMTQzLjc1IDI0LjY5IDE0Ny42NCAyNy4xOSAxNTIuMjAKICBRIDI3LjQxIDE1Mi42MSAyNy42NyAxNTIuNzgKICBBIDAuNzcgMC43MyA4LjQgMCAxIDI3LjkzIDE1My4xMQogIFEgMjguMzcgMTU0LjI5IDI5LjE1IDE1NS4yMQogIEMgMzAuNTAgMTU2LjgzIDMxLjU0IDE1OC4zOCAzMi44NyAxNTkuODMKICBRIDMzLjI2IDE2MC4yNSAzMy42NSAxNTkuODMKICBDIDM1LjQxIDE1Ny45NyAzNi41NyAxNTUuOTEgMzguNzIgMTUzLjU3CiAgQyA0NS4yOCAxNDYuNDcgNTYuNTQgMTQyLjE1IDY1Ljk5IDE0MC45OAogIFEgNzcuMTUgMTM5LjYwIDg4LjI0IDEzNy45MAogIEMgMTAyLjA3IDEzNS43OCAxMTMuNzEgMTI4LjAzIDExNy4xNSAxMTQuNTIKICBRIDExNy40MiAxMTMuNDYgMTE2LjM3IDExMy43OAogIFEgMTAyLjcyIDExNy45OCA4OC43MCAxMTUuMDkKICBRIDg0LjQ0IDExNC4yMSA4OC43NiAxMTMuNjkKICBDIDEwNS4xNCAxMTEuNzAgMTIzLjg5IDEwNi43MSAxMzYuMjAgOTQuNDAKICBDIDEzOC44MSA5MS43OCAxNDAuNzUgODguNTAgMTQyLjQ1IDg1LjIzCiAgUSAxNDIuODggODQuMzggMTQyLjg4IDgzLjQ2CiAgUSAxNDIuODggODMuMzkgMTQyLjk0IDgzLjQ0IgovPgo8cGF0aCBmaWxsPSIjZGRlNmYzIiBkPSIKICBNIDIyLjg4IDAuMDAKICBMIDE1Ny4yMyAwLjAwCiAgUSAxNzYuODggMy4yNCAxODAuMDAgMjIuODgKICBMIDE4MC4wMCAxNTcuMjQKICBRIDE3Ni43NyAxNzYuODggMTU3LjEyIDE4MC4wMAogIEwgMjIuNzYgMTgwLjAwCiAgUSAzLjEyIDE3Ni43NyAwLjAwIDE1Ny4xMgogIEwgMC4wMCAyMi43NgogIFEgMy4yMyAzLjEyIDIyLjg4IDAuMDAKICBaCiAgTSAxNDIuOTQgODMuNDQKICBRIDE0Mi45NyA4My40NiAxNDMuMDIgODMuNDgKICBRIDE0My4yMCA4My41MyAxNDMuMjkgODMuMjYKICBRIDE0NS4wNyA3Ny43NSAxNDUuNDAgNzEuOTcKICBBIDAuMzUgMC4zNSAwLjAgMCAwIDE0NC44NiA3MS42NgogIFEgMTM1LjIyIDc4LjE3IDEyMy43MiA4MS4wMAogIFEgMTIzLjIzIDgxLjExIDEyMi43MyA4MS4xMwogIFEgMTIyLjY1IDgxLjEzIDEyMi43MSA4MS4yMAogIFEgMTIyLjgwIDgxLjMxIDEyMi43NCA4MS41MAogIFEgMTIyLjY4IDgxLjc1IDEyMi40MiA4MS43NwogIEwgMTExLjA0IDgyLjg1CiAgQSAwLjM3IDAuMzcgMC4wIDAgMSAxMTAuODYgODIuMTUKICBRIDEyMS45OSA3Ny4xNyAxMzIuMDggNzAuMDMKICBDIDEzNC43MCA2OC4xOCAxMzcuMTYgNjUuODUgMTM5Ljc0IDYzLjcxCiAgUSAxNDYuNDQgNTguMTMgMTUxLjcxIDUxLjIwCiAgQyAxNTguMTEgNDIuNzcgMTYzLjM4IDMxLjUwIDE2MC4zOCAyMC4zNQogIEEgMC40MyAwLjQzIDAuMCAwIDAgMTU5LjY5IDIwLjEzCiAgQyAxNDIuODcgMzMuODAgMTI1LjI4IDQ2LjUzIDEwNC42MSA1My44MQogIEMgNzUuODcgNjMuOTIgMzcuOTAgNzMuNDEgMjMuNjUgMTA0LjA5CiAgUSAxNi4wMCAxMjAuNTQgMjEuMDYgMTM5LjAyCiAgQyAyMi4zNiAxNDMuNzUgMjQuNjkgMTQ3LjY0IDI3LjE5IDE1Mi4yMAogIFEgMjcuNDEgMTUyLjYxIDI3LjY3IDE1Mi43OAogIEEgMC43NyAwLjczIDguNCAwIDEgMjcuOTMgMTUzLjExCiAgUSAyOC4zNyAxNTQuMjkgMjkuMTUgMTU1LjIxCiAgQyAzMC41MCAxNTYuODMgMzEuNTQgMTU4LjM4IDMyLjg3IDE1OS44MwogIFEgMzMuMjYgMTYwLjI1IDMzLjY1IDE1OS44MwogIEMgMzUuNDEgMTU3Ljk3IDM2LjU3IDE1NS45MSAzOC43MiAxNTMuNTcKICBDIDQ1LjI4IDE0Ni40NyA1Ni41NCAxNDIuMTUgNjUuOTkgMTQwLjk4CiAgUSA3Ny4xNSAxMzkuNjAgODguMjQgMTM3LjkwCiAgQyAxMDIuMDcgMTM1Ljc4IDExMy43MSAxMjguMDMgMTE3LjE1IDExNC41MgogIFEgMTE3LjQyIDExMy40NiAxMTYuMzcgMTEzLjc4CiAgUSAxMDIuNzIgMTE3Ljk4IDg4LjcwIDExNS4wOQogIFEgODQuNDQgMTE0LjIxIDg4Ljc2IDExMy42OQogIEMgMTA1LjE0IDExMS43MCAxMjMuODkgMTA2LjcxIDEzNi4yMCA5NC40MAogIEMgMTM4LjgxIDkxLjc4IDE0MC43NSA4OC41MCAxNDIuNDUgODUuMjMKICBRIDE0Mi44OCA4NC4zOCAxNDIuODggODMuNDYKICBRIDE0Mi44OCA4My4zOSAxNDIuOTQgODMuNDQKICBaIgovPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSIKICBNIDE0Mi44OCA4My40NgogIFEgMTQyLjg4IDg0LjM4IDE0Mi40NSA4NS4yMwogIEMgMTQwLjc1IDg4LjUwIDEzOC44MSA5MS43OCAxMzYuMjAgOTQuNDAKICBDIDEyMy44OSAxMDYuNzEgMTA1LjE0IDExMS43MCA4OC43NiAxMTMuNjkKICBRIDg0LjQ0IDExNC4yMSA4OC43MCAxMTUuMDkKICBRIDEwMi43MiAxMTcuOTggMTE2LjM3IDExMy43OAogIFEgMTE3LjQyIDExMy40NiAxMTcuMTUgMTE0LjUyCiAgQyAxMTMuNzEgMTI4LjAzIDEwMi4wNyAxMzUuNzggODguMjQgMTM3LjkwCiAgUSA3Ny4xNSAxMzkuNjAgNjUuOTkgMTQwLjk4CiAgQyA1Ni41NCAxNDIuMTUgNDUuMjggMTQ2LjQ3IDM4LjcyIDE1My41NwogIEMgMzYuNTcgMTU1LjkxIDM1LjQxIDE1Ny45NyAzMy42NSAxNTkuODMKICBRIDMzLjI2IDE2MC4yNSAzMi44NyAxNTkuODMKICBDIDMxLjU0IDE1OC4zOCAzMC41MCAxNTYuODMgMjkuMTUgMTU1LjIxCiAgUSAyOC4zNyAxNTQuMjkgMjcuOTMgMTUzLjExCiAgQSAwLjc3IDAuNzMgOC40IDAgMCAyNy42NyAxNTIuNzgKICBRIDI3LjQxIDE1Mi42MSAyNy4xOSAxNTIuMjAKICBDIDI0LjY5IDE0Ny42NCAyMi4zNiAxNDMuNzUgMjEuMDYgMTM5LjAyCiAgUSAxNi4wMCAxMjAuNTQgMjMuNjUgMTA0LjA5CiAgQyAzNy45MCA3My40MSA3NS44NyA2My45MiAxMDQuNjEgNTMuODEKICBDIDEyNS4yOCA0Ni41MyAxNDIuODcgMzMuODAgMTU5LjY5IDIwLjEzCiAgQSAwLjQzIDAuNDMgMC4wIDAgMSAxNjAuMzggMjAuMzUKICBDIDE2My4zOCAzMS41MCAxNTguMTEgNDIuNzcgMTUxLjcxIDUxLjIwCiAgUSAxNDYuNDQgNTguMTMgMTM5Ljc0IDYzLjcxCiAgQyAxMzcuMTYgNjUuODUgMTM0LjcwIDY4LjE4IDEzMi4wOCA3MC4wMwogIFEgMTIxLjk5IDc3LjE3IDExMC44NiA4Mi4xNQogIEEgMC4zNyAwLjM3IDAuMCAwIDAgMTExLjA0IDgyLjg1CiAgTCAxMjIuNDIgODEuNzcKICBRIDEyMi42OCA4MS43NSAxMjIuNzQgODEuNTAKICBRIDEyMi44MCA4MS4zMSAxMjIuNzEgODEuMjAKICBRIDEyMi42NSA4MS4xMyAxMjIuNzMgODEuMTMKICBRIDEyMy4yMyA4MS4xMSAxMjMuNzIgODEuMDAKICBRIDEzNS4yMiA3OC4xNyAxNDQuODYgNzEuNjYKICBBIDAuMzUgMC4zNSAwLjAgMCAxIDE0NS40MCA3MS45NwogIFEgMTQ1LjA3IDc3Ljc1IDE0My4yOSA4My4yNgogIFEgMTQzLjIwIDgzLjUzIDE0My4wMiA4My40OAogIFEgMTQyLjk3IDgzLjQ2IDE0Mi45NCA4My40NAogIFEgMTQyLjg4IDgzLjM5IDE0Mi44OCA4My40NgogIFoiCi8+Cjwvc3ZnPgo=",
  },
  // netbox.vmgware.dev
  {
    domain: "netbox.vmgware.dev",
    description:
      "NetBox | IP address management (IPAM) and data center infrastructure management (DCIM) tool",
    logo: "https://netbox.vmgware.dev/static/netbox_logo.svg",
  },
  // forum.vmgware.dev
  {
    domain: "forum.vmgware.dev",
    description: "Flarum | Forums Made Simple",
    logo: "https://forum.vmgware.dev/assets/logo-dzwvmmlh.png",
  },
  // exception.vmgware.dev
  {
    domain: "exception.vmgware.dev",
    description: "ExceptionLess | Real-time error tracking and reporting",
    logo: "https://exception.vmgware.dev/touch-icon-ipad-114.png",
  },
  // portainer.vmgware.dev
  {
    domain: "portainer.vmgware.dev",
    description: "Portainer | Simple management UI for Docker",
    logo: "https://portainer.vmgware.dev/63a301f0574f1a696ce6.png",
  },
  // voice.vmgware.dev
  {
    domain: "voice.vmgware.dev",
    description: "Text-to-Speech | A simple text-to-speech service",
    logo: "",
  },
  // ci.vmgware.dev
  {
    domain: "ci.vmgware.dev",
    description: "Woodpecker | A simple, private, and secure CI/CD service",
    logo: "https://ci.vmgware.dev/favicons/favicon-light-default.png",
  },
]);

const headers = ref([
  { title: "Logo", value: "logo" },
  { title: "Domain", value: "domain" },
  { title: "Description", value: "description" },
]);

const search = ref("");

// Filter sites based on search query
const filteredSites = computed(() => {
  if (!search.value) {
    return sites.value;
  }
  return sites.value.filter(
    (site) =>
      site.domain.toLowerCase().includes(search.value.toLowerCase()) ||
      site.description.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<style>
/* Add any additional styles if necessary */
</style>
