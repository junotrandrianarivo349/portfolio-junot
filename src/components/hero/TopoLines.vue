<template>
  <!-- Topographic lines behind the hero. Inline SVG: no network request, never the LCP element.
       Stroke uses the theme's text colour; opacity is set by the parent. -->
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMaxYMin slice"
    aria-hidden="true"
    focusable="false"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
      vector-effect="non-scaling-stroke"
    >
      <path d="M1116 300 C 1116 246, 1290 234, 1287 306 S 1182 360, 1116 300 Z" />
      <path d="M1039 300 C 1039 196, 1372 174, 1367 312 S 1166 415, 1039 300 Z" />
      <path d="M962 300 C 962 147, 1455 113, 1446 317 S 1149 470, 962 300 Z" />
      <path d="M885 300 C 885 98, 1538 52, 1526 322 S 1132 525, 885 300 Z" />
      <path d="M808 300 C 808 48, 1620 -8, 1606 328 S 1116 580, 808 300 Z" />
      <path d="M731 300 C 731 -2, 1702 -69, 1686 334 S 1100 635, 731 300 Z" />
      <path d="M654 300 C 654 -51, 1785 -129, 1766 339 S 1083 690, 654 300 Z" />
      <path d="M577 300 C 577 -100, 1868 -190, 1845 344 S 1066 745, 577 300 Z" />
      <path d="M500 300 C 500 -150, 1950 -250, 1925 350 S 1050 800, 500 300 Z" />
      <path d="M423 300 C 423 -200, 2032 -310, 2005 356 S 1034 855, 423 300 Z" />
      <path d="M346 300 C 346 -249, 2115 -371, 2084 361 S 1017 910, 346 300 Z" />
      <path d="M269 300 C 269 -298, 2198 -432, 2164 366 S 1000 965, 269 300 Z" />
      <path d="M192 300 C 192 -348, 2280 -492, 2244 372 S 984 1020, 192 300 Z" />
      <path d="M115 300 C 115 -398, 2362 -553, 2324 378 S 968 1075, 115 300 Z" />
    </g>
  </svg>
</template>
