const dashOffset = (length, value) => length * (1 - value);
const drawStroke = (length, value) => ({
  strokeDasharray: length,
  strokeDashoffset: dashOffset(length, value),
});

const renderPathChoice = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M86 520 C215 492 318 506 450 530 C582 506 685 492 814 520"
        fill="none"
        stroke={palette.ink}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={1000}
        strokeDashoffset={dashOffset(1000, visibleProgress)}
      />
      <path
        d="M450 510 C432 458 361 423 232 391 M450 510 C476 450 566 398 710 356"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth={filled ? 28 : 11}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1000}
        strokeDashoffset={dashOffset(1000, visibleProgress)}
      />
      <path
        d="M112 360 L112 202 L244 202 L244 360 Z"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinejoin="round"
        strokeDasharray={720}
        strokeDashoffset={dashOffset(720, visibleProgress)}
      />
      <path
        d="M92 202 L178 132 L264 202 Z"
        fill={filled ? palette.accent : "none"}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinejoin="round"
        strokeDasharray={450}
        strokeDashoffset={dashOffset(450, visibleProgress)}
      />
      <path
        d="M153 360 L153 268 L204 268 L204 360 M132 232 L158 232 M201 232 L225 232"
        fill={filled ? palette.accent : "none"}
        stroke={surfaceStroke}
        strokeWidth="9"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeDasharray={500}
        strokeDashoffset={dashOffset(500, visibleProgress)}
      />
      <path
        d="M697 356 L697 142 M697 150 L803 176 L697 224 Z"
        fill={filled ? palette.accent : "none"}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={600}
        strokeDashoffset={dashOffset(600, visibleProgress)}
      />
      <path
        d="M655 356 C655 326 679 303 708 303 C738 303 762 326 762 356"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={420}
        strokeDashoffset={dashOffset(420, visibleProgress)}
      />
      <path
        d="M450 215 A36 36 0 1 1 449.9 215"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={300}
        strokeDashoffset={dashOffset(300, visibleProgress)}
      />
      <path
        d="M450 287 L450 405 M450 318 L391 366 M450 318 L509 366 M450 405 L408 474 M450 405 L493 474"
        fill="none"
        stroke={palette.ink}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={950}
        strokeDashoffset={dashOffset(950, visibleProgress)}
      />
      <path
        d="M423 258 C438 268 462 268 477 258 M407 182 L390 137 M493 182 L510 137 M450 159 L450 80"
        fill="none"
        stroke={palette.accent}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={340}
        strokeDashoffset={dashOffset(340, visibleProgress)}
      />
      <path
        d="M288 370 L316 345 M594 342 L622 316 M300 411 L335 416 M573 390 L607 401"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={260}
        strokeDashoffset={dashOffset(260, visibleProgress)}
      />
    </svg>
  );
};

const renderBalanceTradeoff = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M122 520 C284 499 616 499 778 520"
        fill="none"
        stroke={palette.ink}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={900}
        strokeDashoffset={dashOffset(900, visibleProgress)}
      />
      <path
        d="M159 241 L741 199"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth={filled ? 27 : 13}
        strokeLinecap="round"
        strokeDasharray={700}
        strokeDashoffset={dashOffset(700, visibleProgress)}
      />
      <path
        d="M450 220 L450 432 M378 474 L450 322 L522 474 Z"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={800}
        strokeDashoffset={dashOffset(800, visibleProgress)}
      />
      <path
        d="M205 238 L205 345 M119 345 L291 345 M128 345 C144 405 266 405 282 345"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={800}
        strokeDashoffset={dashOffset(800, visibleProgress)}
      />
      <path
        d="M695 202 L695 308 M609 308 L781 308 M618 308 C634 368 756 368 772 308"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={800}
        strokeDashoffset={dashOffset(800, visibleProgress)}
      />
      <path
        d="M205 269 A55 55 0 1 1 204.9 269 M205 294 L205 254 M205 294 L239 312"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={620}
        strokeDashoffset={dashOffset(620, visibleProgress)}
      />
      <path
        d="M659 253 C659 235 675 222 695 222 C715 222 731 235 731 253 C731 272 715 285 695 285 C675 285 659 272 659 253 Z M675 253 L715 253 M695 234 L695 272"
        fill={filled ? palette.accent : "none"}
        stroke={surfaceStroke}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={540}
        strokeDashoffset={dashOffset(540, visibleProgress)}
      />
      <path
        d="M632 276 C632 258 648 245 668 245 M722 229 C742 229 758 242 758 260"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={260}
        strokeDashoffset={dashOffset(260, visibleProgress)}
      />
      <path
        d="M420 349 C420 319 442 303 467 308 C489 313 500 336 488 355 C480 368 460 373 453 391 M453 429 L453 430"
        fill="none"
        stroke={palette.accent}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={420}
        strokeDashoffset={dashOffset(420, visibleProgress)}
      />
      <path
        d="M110 169 L145 159 M758 104 L792 80 M95 209 L128 211 M773 159 L807 165"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={260}
        strokeDashoffset={dashOffset(260, visibleProgress)}
      />
    </svg>
  );
};

const renderGrowthStairs = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M94 515 L226 515 L226 431 L370 431 L370 347 L514 347 L514 263 L658 263 L658 179 L806 179 L806 515 Z"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinejoin="round"
        strokeDasharray={3000}
        strokeDashoffset={dashOffset(3000, visibleProgress)}
      />
      <path
        d="M226 431 L370 347 L514 263 L658 179"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth={filled ? 24 : 10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={800}
        strokeDashoffset={dashOffset(800, visibleProgress)}
      />
      <path
        d="M226 403 A29 29 0 1 1 225.9 403 M370 319 A29 29 0 1 1 369.9 319 M514 235 A29 29 0 1 1 513.9 235"
        fill={filled ? palette.accent : "none"}
        stroke={surfaceStroke}
        strokeWidth="9"
        strokeDasharray={720}
        strokeDashoffset={dashOffset(720, visibleProgress)}
      />
      <path
        d="M215 403 L224 412 L242 391 M359 319 L368 328 L386 307 M503 235 L512 244 L530 223"
        fill="none"
        stroke={filled ? palette.paper : palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={300}
        strokeDashoffset={dashOffset(300, visibleProgress)}
      />
      <path
        d="M639 95 A31 31 0 1 1 638.9 95"
        fill={filled ? palette.paper : "none"}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={280}
        strokeDashoffset={dashOffset(280, visibleProgress)}
      />
      <path
        d="M639 157 L639 232 M639 176 L594 205 M639 176 L685 146 M639 232 L606 279 M639 232 L683 263"
        fill="none"
        stroke={palette.ink}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={820}
        strokeDashoffset={dashOffset(820, visibleProgress)}
      />
      <path
        d="M679 146 L733 115 M733 115 L711 113 M733 115 L723 135"
        fill="none"
        stroke={palette.accent}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={320}
        strokeDashoffset={dashOffset(320, visibleProgress)}
      />
      <path
        d="M744 179 L744 78 M744 83 L823 103 L744 134 Z"
        fill={filled ? palette.accent : "none"}
        stroke={surfaceStroke}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={500}
        strokeDashoffset={dashOffset(500, visibleProgress)}
      />
      <path
        d="M118 467 L148 467 M270 383 L300 383 M414 299 L444 299 M558 215 L588 215"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={260}
        strokeDashoffset={dashOffset(260, visibleProgress)}
      />
      <path
        d="M117 139 C198 90 289 84 364 119 M134 107 L109 139 L151 144 M351 91 L365 119 L334 130"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={600}
        strokeDashoffset={dashOffset(600, visibleProgress)}
      />
    </svg>
  );
};

const renderFilterFunnel = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M88 93 L238 93 L238 161 L88 161 Z M375 93 L525 93 L525 161 L375 161 Z M662 93 L812 93 L812 161 L662 161 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinejoin="round"
        {...drawStroke(1400, visibleProgress)}
      />
      <path
        d="M126 126 L198 126 M413 126 L485 126 M700 126 L772 126"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth="12"
        strokeLinecap="square"
        {...drawStroke(300, visibleProgress)}
      />
      <path
        d="M163 161 L264 220 M450 161 L450 220 M737 161 L636 220"
        fill="none"
        stroke={palette.ink}
        strokeWidth="9"
        strokeLinecap="round"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M188 220 L712 220 L548 382 L548 438 L352 438 L352 382 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        strokeLinejoin="round"
        {...drawStroke(1800, visibleProgress)}
      />
      <path
        d="M252 270 L648 270 M297 317 L603 317 M342 363 L558 363"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth={filled ? 20 : 9}
        strokeLinecap="round"
        {...drawStroke(1100, visibleProgress)}
      />
      <path
        d="M450 438 L450 474"
        fill="none"
        stroke={palette.ink}
        strokeWidth="12"
        strokeLinecap="round"
        {...drawStroke(80, visibleProgress)}
      />
      <path
        d="M377 474 L523 474 L523 531 L377 531 Z"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinejoin="round"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M413 502 L438 521 L486 486"
        fill="none"
        stroke={filled ? palette.paper : palette.accent}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(150, visibleProgress)}
      />
      <path
        d="M104 196 L132 183 M768 183 L796 196 M423 551 L477 551"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        {...drawStroke(180, visibleProgress)}
      />
    </svg>
  );
};

const renderCashflowAccount = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M101 80 L799 80 L799 514 L101 514 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        strokeLinejoin="round"
        {...drawStroke(2300, visibleProgress)}
      />
      <path
        d="M101 162 L799 162 M149 121 L169 121 M197 121 L217 121 M245 121 L265 121"
        fill="none"
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinecap="square"
        {...drawStroke(900, visibleProgress)}
      />
      <path
        d="M157 227 L157 447 M157 447 L602 447"
        fill="none"
        stroke={palette.ink}
        strokeWidth="9"
        strokeLinecap="round"
        {...drawStroke(800, visibleProgress)}
      />
      <path
        d="M204 249 L292 249 L292 447 L204 447 Z M337 303 L425 303 L425 447 L337 447 Z M470 362 L558 362 L558 447 L470 447 Z"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinejoin="round"
        {...drawStroke(1300, visibleProgress)}
      />
      <path
        d="M204 219 L292 219 M337 273 L425 273 M470 332 L558 332"
        fill="none"
        stroke={palette.accent}
        strokeWidth="10"
        strokeLinecap="round"
        {...drawStroke(300, visibleProgress)}
      />
      <path
        d="M236 249 L381 303 L514 362"
        fill="none"
        stroke={palette.ink}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M656 326 A82 82 0 1 1 655.9 326"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        {...drawStroke(600, visibleProgress)}
      />
      <path
        d="M656 274 L656 342 M656 379 L656 380"
        fill="none"
        stroke={filled ? palette.surfaceInk : palette.accent}
        strokeWidth="16"
        strokeLinecap="round"
        {...drawStroke(180, visibleProgress)}
      />
      <path
        d="M622 220 C648 198 696 201 721 231 M713 203 L721 231 L691 230"
        fill="none"
        stroke={palette.accent}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(320, visibleProgress)}
      />
      <path
        d="M112 539 L300 539 M600 539 L788 539"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="square"
        {...drawStroke(400, visibleProgress)}
      />
    </svg>
  );
};

const renderResourceNetwork = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M450 292 L190 151 M450 292 L710 151 M450 292 L163 454 M450 292 L737 454"
        fill="none"
        stroke={palette.ink}
        strokeWidth="10"
        strokeLinecap="round"
        {...drawStroke(1400, visibleProgress)}
      />
      <path
        d="M190 151 C318 74 582 74 710 151 M163 454 C308 527 592 527 737 454"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        {...drawStroke(800, visibleProgress)}
      />
      <path
        d="M110 92 L270 92 L270 210 L110 210 Z M630 92 L790 92 L790 210 L630 210 Z M83 395 L243 395 L243 513 L83 513 Z M657 395 L817 395 L817 513 L657 513 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinejoin="round"
        {...drawStroke(2100, visibleProgress)}
      />
      <path
        d="M145 151 A45 45 0 1 1 144.9 151 M675 145 L710 120 L755 145 L739 186 L691 186 Z M119 432 L205 432 L205 472 L119 472 Z M692 428 L782 428 M692 456 L758 456 M692 484 L735 484"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(1300, visibleProgress)}
      />
      <path
        d="M450 198 A54 54 0 1 1 449.9 198"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        {...drawStroke(400, visibleProgress)}
      />
      <path
        d="M450 252 L450 391 M450 287 L378 338 M450 287 L522 338 M450 391 L397 470 M450 391 L503 470"
        fill="none"
        stroke={palette.ink}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(1000, visibleProgress)}
      />
      <path
        d="M413 202 C430 216 470 216 487 202 M405 160 L388 132 M495 160 L512 132"
        fill="none"
        stroke={palette.accent}
        strokeWidth="9"
        strokeLinecap="round"
        {...drawStroke(320, visibleProgress)}
      />
      <path
        d="M304 272 A22 22 0 1 1 303.9 272 M596 272 A22 22 0 1 1 595.9 272 M304 338 A22 22 0 1 1 303.9 338 M596 338 A22 22 0 1 1 595.9 338"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="8"
        {...drawStroke(600, visibleProgress)}
      />
    </svg>
  );
};

const renderMagnifierDiscovery = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M360 280 A170 170 0 1 1 359.9 280"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="14"
        {...drawStroke(1200, visibleProgress)}
      />
      <path
        d="M480 400 L706 526"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth={filled ? 42 : 18}
        strokeLinecap="round"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M236 210 L356 210 L356 268 L236 268 Z M378 289 L484 289 L484 347 L378 347 Z M238 369 L365 369 L365 427 L238 427 Z"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinejoin="round"
        {...drawStroke(1250, visibleProgress)}
      />
      <path
        d="M266 239 L326 239 M408 318 L454 318 M268 398 L335 398"
        fill="none"
        stroke={filled ? palette.paper : palette.accent}
        strokeWidth="10"
        strokeLinecap="square"
        {...drawStroke(260, visibleProgress)}
      />
      <path
        d="M108 145 L180 145 M130 101 L183 127 M790 134 L720 156 M765 91 L714 126 M780 443 L711 422"
        fill="none"
        stroke={palette.accent}
        strokeWidth="9"
        strokeLinecap="round"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M117 499 C196 469 260 479 316 515 M756 505 C788 486 808 456 817 421"
        fill="none"
        stroke={palette.ink}
        strokeWidth="9"
        strokeLinecap="round"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M590 444 L635 419 M610 475 L656 449"
        fill="none"
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinecap="round"
        {...drawStroke(140, visibleProgress)}
      />
    </svg>
  );
};

const renderDoorEntry = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M96 111 L355 111 L355 520 L96 520 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        strokeLinejoin="round"
        {...drawStroke(1500, visibleProgress)}
      />
      <path
        d="M319 315 A13 13 0 1 1 318.9 315"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="8"
        {...drawStroke(120, visibleProgress)}
      />
      <path
        d="M490 520 L490 82 L806 82 L806 520 M490 520 L806 520"
        fill="none"
        stroke={palette.ink}
        strokeWidth="13"
        strokeLinecap="square"
        strokeLinejoin="round"
        {...drawStroke(1400, visibleProgress)}
      />
      <path
        d="M490 82 L682 139 L682 520 L490 520 Z"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinejoin="round"
        {...drawStroke(1300, visibleProgress)}
      />
      <path
        d="M648 329 A12 12 0 1 1 647.9 329"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="7"
        {...drawStroke(100, visibleProgress)}
      />
      <path
        d="M526 478 L767 478 L811 520 L482 520 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinejoin="round"
        {...drawStroke(900, visibleProgress)}
      />
      <path
        d="M531 260 A38 38 0 1 1 530.9 260"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        {...drawStroke(300, visibleProgress)}
      />
      <path
        d="M531 298 L565 395 M544 328 L491 372 M549 330 L607 359 M565 395 L521 477 M565 395 L631 453"
        fill="none"
        stroke={palette.ink}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(850, visibleProgress)}
      />
      <path
        d="M367 315 L450 315 M421 286 L450 315 L421 344"
        fill="none"
        stroke={palette.accent}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(240, visibleProgress)}
      />
      <path
        d="M105 552 L288 552 M612 552 L797 552"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="square"
        {...drawStroke(400, visibleProgress)}
      />
    </svg>
  );
};

const renderRiskGauge = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M105 474 A345 345 0 0 1 795 474 L700 474 A250 250 0 0 0 200 474 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        strokeLinejoin="round"
        {...drawStroke(2600, visibleProgress)}
      />
      <path
        d="M205 411 A270 270 0 0 1 308 266 M344 245 A270 270 0 0 1 505 209 M548 218 A270 270 0 0 1 681 305 M709 338 A270 270 0 0 1 741 413"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth={filled ? 24 : 11}
        strokeLinecap="round"
        {...drawStroke(1100, visibleProgress)}
      />
      <path
        d="M239 391 L201 365 M498 245 L507 194 M699 418 L750 405"
        fill="none"
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinecap="round"
        {...drawStroke(260, visibleProgress)}
      />
      <path
        d="M450 474 L625 304"
        fill="none"
        stroke={palette.accent}
        strokeWidth="18"
        strokeLinecap="round"
        {...drawStroke(420, visibleProgress)}
      />
      <path
        d="M450 474 A48 48 0 1 1 449.9 474"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        {...drawStroke(350, visibleProgress)}
      />
      <path
        d="M159 509 L741 509"
        fill="none"
        stroke={palette.ink}
        strokeWidth="12"
        strokeLinecap="round"
        {...drawStroke(700, visibleProgress)}
      />
      <path
        d="M168 170 L210 129 M732 170 L690 129 M450 137 L450 80"
        fill="none"
        stroke={palette.accent}
        strokeWidth="10"
        strokeLinecap="round"
        {...drawStroke(260, visibleProgress)}
      />
      <path
        d="M413 541 L487 541"
        fill="none"
        stroke={palette.accent}
        strokeWidth="8"
        strokeLinecap="square"
        {...drawStroke(100, visibleProgress)}
      />
    </svg>
  );
};

const renderCalendarTime = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M91 407 C151 317 230 286 345 280"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth={filled ? 24 : 11}
        strokeLinecap="round"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M309 249 L353 279 L312 314"
        fill="none"
        stroke={palette.accent}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(150, visibleProgress)}
      />
      <path
        d="M111 365 A36 36 0 1 1 110.9 365 M211 300 A36 36 0 1 1 210.9 300 M330 280 A36 36 0 1 1 329.9 280"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="10"
        {...drawStroke(800, visibleProgress)}
      />
      <path
        d="M99 365 L109 375 L127 350 M199 300 L209 310 L227 285 M318 280 L328 290 L346 265"
        fill="none"
        stroke={filled ? palette.paper : palette.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(260, visibleProgress)}
      />
      <path
        d="M492 71 L807 71 L807 273 L492 273 Z M465 198 L780 198 L780 400 L465 400 Z M438 325 L753 325 L753 527 L438 527 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinejoin="round"
        {...drawStroke(2700, visibleProgress)}
      />
      <path
        d="M492 129 L807 129 M465 256 L780 256 M438 383 L753 383"
        fill="none"
        stroke={filled ? palette.accent : palette.ink}
        strokeWidth={filled ? 20 : 9}
        {...drawStroke(1100, visibleProgress)}
      />
      <path
        d="M548 170 L584 170 M621 170 L657 170 M694 170 L730 170 M521 297 L557 297 M594 297 L630 297 M667 297 L703 297 M494 424 L530 424 M567 424 L603 424 M640 424 L676 424"
        fill="none"
        stroke={surfaceStroke}
        strokeWidth="9"
        strokeLinecap="square"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M129 493 L357 493 M157 531 L329 531"
        fill="none"
        stroke={palette.ink}
        strokeWidth="9"
        strokeLinecap="round"
        {...drawStroke(500, visibleProgress)}
      />
    </svg>
  );
};

const renderProofComparison = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M79 92 L405 92 L405 516 L79 516 Z M495 92 L821 92 L821 516 L495 516 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        strokeLinejoin="round"
        {...drawStroke(2300, visibleProgress)}
      />
      <path
        d="M450 69 L450 539"
        fill="none"
        stroke={palette.accent}
        strokeWidth="10"
        strokeLinecap="square"
        {...drawStroke(600, visibleProgress)}
      />
      <path
        d="M163 245 C125 211 136 157 181 157 C207 157 224 175 242 198 C260 175 277 157 303 157 C348 157 359 211 321 245 L242 322 Z"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinejoin="round"
        {...drawStroke(900, visibleProgress)}
      />
      <path
        d="M129 390 L355 390 M160 431 L324 431 M192 472 L292 472"
        fill="none"
        stroke={palette.ink}
        strokeWidth="11"
        strokeLinecap="round"
        {...drawStroke(600, visibleProgress)}
      />
      <path
        d="M563 144 L742 144 L742 386 L704 367 L672 386 L637 367 L601 386 L563 367 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        strokeLinejoin="round"
        {...drawStroke(1300, visibleProgress)}
      />
      <path
        d="M603 202 L702 202 M603 244 L682 244 M603 286 L712 286 M603 328 L658 328"
        fill="none"
        stroke={surfaceStroke}
        strokeWidth="9"
        strokeLinecap="square"
        {...drawStroke(450, visibleProgress)}
      />
      <path
        d="M684 424 A62 62 0 1 1 683.9 424"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="11"
        {...drawStroke(500, visibleProgress)}
      />
      <path
        d="M658 424 L675 441 L712 401"
        fill="none"
        stroke={filled ? palette.paper : palette.accent}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(150, visibleProgress)}
      />
      <path
        d="M525 477 L591 477 M758 477 L798 477"
        fill="none"
        stroke={palette.accent}
        strokeWidth="9"
        strokeLinecap="round"
        {...drawStroke(130, visibleProgress)}
      />
    </svg>
  );
};

const renderActionChecklist = (palette, drawProgress, filled) => {
  const visibleProgress = filled ? 1 : drawProgress;
  const surfaceStroke = filled ? palette.surfaceInk : palette.ink;
  const paperFill = filled ? palette.paper : "none";
  const accentFill = filled ? palette.accent : "none";
  return (
    <svg
      viewBox="0 0 900 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        d="M89 75 L548 75 L548 525 L89 525 Z"
        fill={paperFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        strokeLinejoin="round"
        {...drawStroke(1900, visibleProgress)}
      />
      <path
        d="M149 142 L223 142 L223 216 L149 216 Z M149 264 L223 264 L223 338 L149 338 Z M149 386 L223 386 L223 460 L149 460 Z"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinejoin="round"
        {...drawStroke(900, visibleProgress)}
      />
      <path
        d="M165 178 L183 197 L211 159 M165 300 L183 319 L211 281 M165 422 L183 441 L211 403"
        fill="none"
        stroke={filled ? palette.paper : palette.accent}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(320, visibleProgress)}
      />
      <path
        d="M273 163 L483 163 M273 195 L421 195 M273 285 L483 285 M273 317 L448 317 M273 407 L483 407 M273 439 L399 439"
        fill="none"
        stroke={surfaceStroke}
        strokeWidth="10"
        strokeLinecap="square"
        {...drawStroke(1000, visibleProgress)}
      />
      <path
        d="M548 300 L646 300 M614 268 L646 300 L614 332"
        fill="none"
        stroke={palette.ink}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(300, visibleProgress)}
      />
      <path
        d="M646 200 L820 200 L820 400 L646 400 Z"
        fill={accentFill}
        stroke={surfaceStroke}
        strokeWidth="12"
        strokeLinejoin="round"
        {...drawStroke(800, visibleProgress)}
      />
      <path
        d="M681 300 L718 337 L787 260"
        fill="none"
        stroke={filled ? palette.paper : palette.accent}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawStroke(260, visibleProgress)}
      />
      <path
        d="M676 164 L676 113 M733 149 L750 97 M788 168 L816 126 M676 436 L676 487 M733 451 L750 503 M788 432 L816 474"
        fill="none"
        stroke={palette.accent}
        strokeWidth="9"
        strokeLinecap="round"
        {...drawStroke(420, visibleProgress)}
      />
    </svg>
  );
};

const renderMotif = (scene, palette, drawProgress, fillProgress) => {
  const motif = scene.illustration.motif;
  const MOTIF_RENDERERS = {
    "path-choice": renderPathChoice,
    "balance-tradeoff": renderBalanceTradeoff,
    "growth-stairs": renderGrowthStairs,
    "filter-funnel": renderFilterFunnel,
    "cashflow-account": renderCashflowAccount,
    "resource-network": renderResourceNetwork,
    "magnifier-discovery": renderMagnifierDiscovery,
    "door-entry": renderDoorEntry,
    "risk-gauge": renderRiskGauge,
    "calendar-time": renderCalendarTime,
    "proof-comparison": renderProofComparison,
    "action-checklist": renderActionChecklist,
  };
  const renderSvg = (filled) => {
    const motifRenderer = MOTIF_RENDERERS[motif] || renderMagnifierDiscovery;
    return motifRenderer(palette, drawProgress, filled);
  };
  const motifLayerStyle = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ ...motifLayerStyle, opacity: 1 - fillProgress }}>
        {renderSvg(false)}
      </div>
      <div style={{ ...motifLayerStyle, opacity: fillProgress }}>
        {renderSvg(true)}
      </div>
    </div>
  );
};

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const PLAN = __PLAN_JSON__;
  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const easeOut = (value) => 1 - Math.pow(1 - clamp01(value), 3);
  const progress = (start, frames) => easeOut((frame - start) / Math.max(1, frames));

  const width = PLAN.canvas.width;
  const height = PLAN.canvas.height;
  const safeLeft = width * 0.06;
  const safeWidth = width * 0.88;
  const seriesTop = height * 0.08;
  const textTop = height * 0.17;
  const textHeight = height * 0.23;
  const illustrationTop = height * 0.42;
  const illustrationHeight = height * 0.33;
  const captionReservedTop = height * 0.78;

  const currentSceneIndex = Math.max(
    0,
    PLAN.scenes.findIndex(
      (candidate) => frame >= candidate.startFrame && frame < candidate.endFrame,
    ),
  );
  const scene = PLAN.scenes[currentSceneIndex];
  const localFrame = frame - scene.startFrame;
  const sceneProgress =
    currentSceneIndex === 0 ? 1 : easeOut((localFrame + 1) / 6);
  const drawProgress = progress(scene.startFrame - 1, scene.drawFrames);
  const fillProgress = progress(scene.startFrame + scene.drawFrames, scene.fillFrames);
  const keywordProgresses = scene.keywords.map((keyword) =>
    progress(keyword.startFrame, 6),
  );

  const rootStyle = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    backgroundColor: props.transparentBackground ? "transparent" : props.creamColor,
    fontFamily: props.fontFamily,
    color: props.textColor,
  };
  const seriesStyle = {
    position: "absolute",
    left: safeLeft,
    top: seriesTop,
    fontSize: width * 0.024,
    fontWeight: 800,
    letterSpacing: "0.08em",
  };
  const headerText = [props.seriesLabel, props.brandText]
    .filter((value) => typeof value === "string" && value.trim() !== "")
    .join(" · ");
  const textBlockStyle = {
    position: "absolute",
    left: safeLeft,
    top: textTop,
    width: safeWidth,
    height: textHeight,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  };
  const titleStyle = {
    maxWidth: safeWidth,
    fontSize: width * 0.066,
    lineHeight: 1.12,
    fontWeight: 900,
    letterSpacing: "-0.035em",
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };
  const keywordRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: width * 0.014,
    marginTop: height * 0.018,
  };
  const keywordStyle = (value, index) => ({
    padding: `${height * 0.006}px ${width * 0.018}px`,
    border: `3px solid ${props.surfaceInkColor}`,
    borderRadius: 0,
    backgroundColor: index === 0 ? props.surfaceInkColor : props.surfaceColor,
    color: index === 0 ? props.surfaceColor : props.surfaceInkColor,
    fontSize: width * 0.028,
    fontWeight: 800,
    opacity: value,
    transform: `translateY(${(1 - value) * height * 0.008}px)`,
  });
  const kickerStyle = {
    padding: `${height * 0.005}px ${width * 0.014}px`,
    marginBottom: height * 0.012,
    borderRadius: 0,
    backgroundColor: props.accentColor,
    color: props.creamColor,
    fontSize: width * 0.021,
    lineHeight: 1.2,
    fontWeight: 900,
    letterSpacing: "0.04em",
  };
  const conclusionStyle = {
    maxWidth: safeWidth,
    marginTop: height * 0.016,
    fontSize: width * 0.031,
    lineHeight: 1.3,
    fontWeight: 700,
  };
  const illustrationStyle = {
    position: "absolute",
    left: safeLeft,
    top: illustrationTop,
    width: safeWidth,
    height: illustrationHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };
  const contentSafeStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    width,
    height: captionReservedTop,
    overflow: "hidden",
  };
  const sceneLayerStyle = {
    position: "absolute",
    inset: 0,
  };
  const textMaskStyle = {
    clipPath: `inset(0 ${(1 - sceneProgress) * 100}% 0 0)`,
  };
  const palette = {
    ink: props.textColor,
    surfaceInk: props.surfaceInkColor,
    accent: props.accentColor,
    paper: props.surfaceColor,
  };
  const renderTextBlock = (sceneToRender, values) => (
    <div style={textBlockStyle}>
      {typeof sceneToRender.kicker === "string" && sceneToRender.kicker.trim() !== "" ? (
        <div style={kickerStyle}>{sceneToRender.kicker}</div>
      ) : null}
      <div style={titleStyle}>{sceneToRender.title}</div>
      <div style={keywordRowStyle}>
        {sceneToRender.keywords.map((keyword, index) => (
          <div key={`${sceneToRender.id}-${keyword.text}`} style={keywordStyle(values[index], index)}>
            {keyword.text}
          </div>
        ))}
      </div>
      {typeof sceneToRender.conclusion === "string" &&
      sceneToRender.conclusion.trim() !== "" ? (
        <div style={conclusionStyle}>{sceneToRender.conclusion}</div>
      ) : null}
    </div>
  );
  const renderSceneLayers = (
    sceneToRender,
    values,
    motifDrawProgress,
    motifFillProgress,
    keyPrefix,
  ) => [
    <div
      key={`${keyPrefix}-text`}
      style={{ ...sceneLayerStyle, ...textMaskStyle }}
    >
      {renderTextBlock(sceneToRender, values)}
    </div>,
    <div key={`${keyPrefix}-illustration`} style={sceneLayerStyle}>
      <div style={illustrationStyle}>
        {renderMotif(
          sceneToRender,
          palette,
          motifDrawProgress,
          motifFillProgress,
        )}
      </div>
    </div>,
  ];

  return (
    <div style={rootStyle}>
      {headerText ? <div style={seriesStyle}>{headerText}</div> : null}
      <div style={contentSafeStyle}>
        {renderSceneLayers(
          scene,
          keywordProgresses,
          drawProgress,
          fillProgress,
          "current",
        )}
      </div>
    </div>
  );
};
