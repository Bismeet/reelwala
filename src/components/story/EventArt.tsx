type Occasion = "private" | "corporate" | "cultural";

// Original vector artwork. The same people, ribbon and stage recur through the story.
export default function EventArt({
  id,
  occasion = "private",
  detail = false,
}: {
  id: string;
  occasion?: Occasion;
  detail?: boolean;
}) {
  const corporate = occasion === "corporate";
  const cultural = occasion === "cultural";
  return (
    <svg
      data-event-art
      data-occasion={occasion}
      viewBox={detail ? "265 90 470 510" : "0 0 1000 650"}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-arch`}
          x1="280"
          y1="80"
          x2="770"
          y2="600"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={corporate ? "#0c736b" : "#236055"} />
          <stop offset="1" stopColor="#102b27" />
        </linearGradient>
        <linearGradient
          id={`${id}-gold`}
          x1="300"
          y1="210"
          x2="600"
          y2="570"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffd782" />
          <stop offset=".55" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#c46e16" />
        </linearGradient>
        <linearGradient
          id={`${id}-ribbon`}
          x1="100"
          y1="380"
          x2="860"
          y2="300"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c77b22" />
          <stop offset=".27" stopColor="#ffc96a" />
          <stop offset=".65" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ae6619" />
        </linearGradient>
        <linearGradient
          id={`${id}-floor`}
          x1="300"
          y1="480"
          x2="760"
          y2="610"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#82b9a2" />
          <stop offset="1" stopColor="#397361" />
        </linearGradient>
      </defs>
      <ellipse
        cx="514"
        cy="601"
        rx="383"
        ry="31"
        fill="#102b27"
        opacity=".08"
      />
      <g data-art-backdrop>
        <path
          d={
            corporate
              ? "M265 120H735V550H265Z"
              : "M265 550V300a235 235 0 0 1 470 0v250Z"
          }
          fill={`url(#${id}-arch)`}
        />
        <path
          d={
            corporate
              ? "M290 145H710V520H290Z"
              : "M288 530V302a212 212 0 0 1 424 0v228"
          }
          stroke="#85b4a0"
          opacity=".45"
        />
        <path
          d="M314 521V301a186 186 0 0 1 372 0v220"
          stroke="#85b4a0"
          opacity=".2"
        />
        <circle cx="500" cy="247" r="93" fill="#fff9ef" opacity=".035" />
        <path d="M290 140 647 545H704L358 113Z" fill="#fff9ef" opacity=".035" />
        {cultural && (
          <g stroke="#f6c974" strokeWidth="3">
            <path d="M260 174Q500 318 741 174" />
            <path d="M326 203v65m348-65v65m-172-20v52" />
            <path
              d="m309 270 17-24 17 24-17 24Zm348 0 17-24 17 24-17 24Zm-174 30 19-28 19 28-19 28Z"
              fill="#f59e0b"
            />
          </g>
        )}
        {!cultural && !corporate && (
          <g fill="#f5c476">
            <path d="M328 117q0 25-20 25 20 0 20 25 0-25 20-25-20 0-20-25" />
            <path d="M651 245q0 19-16 19 16 0 16 19 0-19 16-19-16 0-16-19" />
          </g>
        )}
        {corporate && (
          <g stroke="#0bf5e2" opacity=".6">
            <path d="M449 175h102v76H449z" />
            <path d="m477 207 19 18 34-42" strokeWidth="3" />
          </g>
        )}
      </g>
      <g data-art-stage>
        <path
          d="M163 534v30c0 46 155 79 347 79s347-33 347-79v-30Z"
          fill="#2f6052"
        />
        <ellipse
          cx="510"
          cy="534"
          rx="347"
          ry="75"
          fill={`url(#${id}-floor)`}
        />
        <path d="M163 546c45 86 654 91 694-3" stroke="#b9d2b7" opacity=".4" />
        <ellipse
          cx="504"
          cy="514"
          rx="222"
          ry="45"
          fill="#adc9ac"
          opacity=".24"
        />
        <ellipse
          cx="445"
          cy="532"
          rx="62"
          ry="13"
          fill="#183f34"
          opacity=".22"
        />
        <ellipse
          cx="615"
          cy="537"
          rx="55"
          ry="13"
          fill="#183f34"
          opacity=".22"
        />
      </g>
      <g data-art-ribbon-back>
        <path
          d="M104 354c66-132 180-139 229-102 34 26-30 68-78 46-38-18 57-72 122-58"
          stroke={`url(#${id}-ribbon)`}
          strokeWidth="29"
        />
        <path
          d="M108 348c64-122 172-132 221-99"
          stroke="#ffe0a3"
          strokeWidth="2"
        />
      </g>
      <g data-art-person="left">
        <path
          d="m399 420-26 91-31 8"
          stroke="#ba744f"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="m457 424 39 74-4 32"
          stroke="#ba744f"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path d="m377 516-26-1q-27 6-24 17h53Z" fill="#17342d" />
        <path d="m482 523 20 2 7 24h-37Z" fill="#17342d" />
        <path
          d="M408 281c-27 15-34 68-42 102-7 29-35 64-35 64 43 29 125 37 166-9-34-37-24-115-45-146Z"
          fill={`url(#${id}-gold)`}
        />
        <path
          d="M416 299c-5 52-11 91-35 145m53-142c6 47 15 94 38 139"
          stroke="#b97017"
          strokeWidth="2"
          opacity=".4"
        />
        <path
          d="m400 302-41-40-10-63"
          stroke="#c28761"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="m351 204-7-20 5-18m-1 21 13-10"
          stroke="#c28761"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="m449 304 49-38 28-51"
          stroke="#c28761"
          strokeWidth="17"
          strokeLinecap="round"
        />
        <path
          d="m525 216 13-16-1-18m-6 21-2-13"
          stroke="#c28761"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="m412 268 3 26q18 13 28-1l-8-29Z" fill="#a65f41" />
        <ellipse
          cx="421"
          cy="249"
          rx="26"
          ry="32"
          transform="rotate(-12 421 249)"
          fill="#c78a63"
        />
        <path
          d="M394 254q-23-39 15-49 48-9 45 40-20-5-28-23-6 28-32 32"
          fill="#172b26"
        />
        <circle cx="451" cy="218" r="16" fill="#172b26" />
        <path
          d="m415 253 1 1m17-5 1 1"
          stroke="#342b23"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="m422 265 9-2"
          stroke="#713f30"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="400" cy="264" r="4" stroke="#ffe4a8" strokeWidth="3" />
        <path d="m364 250-14 4m145 8 13 8" stroke="#ffe3a2" strokeWidth="6" />
      </g>
      <g data-art-person="right">
        <path
          d="m582 420-7 104-30 9m67-113 32 70 29 23"
          stroke="#112d28"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M571 523q-31-4-44 17h57v-18m77-18-5 18 35 17q10-9-3-20Z"
          fill="#e9d8b6"
        />
        <path
          d="m569 288-14 123q32 27 81 7l-14-127Z"
          fill={corporate ? "#e5ddc5" : "#07ac9f"}
        />
        <path
          d="m582 297 2 110m10-110 11 114"
          stroke="#fff9ef"
          opacity=".2"
          strokeWidth="2"
        />
        <path
          d="m567 307-39-24-3-52"
          stroke="#955c40"
          strokeWidth="17"
          strokeLinecap="round"
        />
        <path
          d="m620 309 45-46 27-28"
          stroke="#955c40"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="m690 237 14-22m-9 18 18-6"
          stroke="#955c40"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path d="m580 270 2 24 24 2-3-31" fill="#7d4935" />
        <ellipse
          cx="593"
          cy="249"
          rx="27"
          ry="33"
          transform="rotate(8 593 249)"
          fill="#a66c49"
        />
        <path
          d="M566 246q-11-34 12-37 9-12 29-4 26 3 17 39l-11-9-7-13q-15 17-40 11Z"
          fill="#172b26"
        />
        <path
          d="m582 250 1 1m18 0 1 1"
          stroke="#33291f"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="m586 266 11 1"
          stroke="#603828"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {corporate && (
          <g transform="translate(689 167)">
            <path d="M0 0h35v20q-17 28-35 0Z" fill="#f5bd54" />
            <path
              d="M0 5h-12q-2 24 15 22m32-22h12q2 24-15 22M18 31v15m-14 2h28"
              stroke="#f5bd54"
              strokeWidth="5"
            />
          </g>
        )}
      </g>
      {cultural && (
        <g data-art-drum>
          <ellipse cx="515" cy="365" rx="32" ry="18" fill="#e6cda0" />
          <path d="M483 365v57q30 23 64 0v-57" fill="#c68432" />
          <ellipse cx="515" cy="365" rx="32" ry="15" fill="#f2dbaf" />
          <path
            d="m486 370 12 50 17-40 17 40 12-50"
            stroke="#fff9ef"
            strokeWidth="3"
          />
        </g>
      )}
      <g data-art-ribbon-front>
        <path
          d="M104 354c-24 58 87 121 227 112 169-10 149 75 332 27 178-47 272-139 225-175-34-27-98 18-80 52"
          stroke={`url(#${id}-ribbon)`}
          strokeWidth="29"
        />
        <path
          d="M107 345c-19 67 91 106 224 105 169-2 149 75 332 27 178-47 258-126 225-159"
          stroke="#ffde99"
          strokeWidth="2"
        />
      </g>
      <g data-art-confetti>
        <path
          d="m193 227 9-28m600 14 16 12m-73-130 9 21m-65-66 14-3m-447 7-14 13m-16 324-20 4m603-11 13 10"
          stroke="#f59e0b"
          strokeWidth="8"
        />
        <path
          d="m242 362-15-12m553-67 11-17m-394-183 6 17m340 319 16-2m-480-62-9 18"
          stroke="#07ac9f"
          strokeWidth="7"
        />
        <circle cx="218" cy="285" r="5" fill="#f5c76f" />
        <circle cx="779" cy="160" r="5" fill="#07ac9f" />
        <path d="m818 432 8-15 8 15-8 15Z" fill="#0bf5e2" />
      </g>
    </svg>
  );
}
