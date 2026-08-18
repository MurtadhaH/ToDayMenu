"use strict";

/* =====================================================
   MURTADHA ALTUFaily
   REUSABLE DEVELOPER SIGNATURE

   File: dev.js
===================================================== */

(() => {

    /* ===================================================
       CONFIGURATION
    =================================================== */

    const developer = {

        name: "Murtadha Altufaily",

        title: "Full-Stack Developer",

        specialty: "Automation & Robotics",

        experience: "6+ Years",

        phoneDisplay: "+964 786 456 6840",

        phoneLink: "+9647864566840",

        email: "murtadhaaltufaily@gmail.com",

        highlights: [
            {
                value: "6+",
                label: "Years"
            },
            {
                value: "Full-Stack",
                label: "Development"
            },
            {
                value: "Python",
                label: "Automation"
            },
            {
                value: "Robotics",
                label: "Engineering"
            }
        ],

        skills: [
            "JavaScript",
            "Vue.js",
            "PHP",
            "MySQL",
            "Python",
            "C# / .NET",
            "HTML5",
            "CSS3",
            "AJAX",
            "SQL",
            "Git",
            "Linux",
            "MATLAB",
            "3D Modeling"
        ]

    };


    /* ===================================================
       PREVENT DUPLICATE COMPONENT
    =================================================== */

    if (
        document.getElementById(
            "devSignature"
        )
    ) {
        return;
    }


    /* ===================================================
       HELPERS
    =================================================== */

    function escapeHTML(value) {

        return String(value)

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }


    function escapeAttribute(value) {

        return escapeHTML(value);

    }


    /* ===================================================
       SINGLE-VALUE MARQUEE
  
       IMPORTANT:
  
       Only ONE copy of the text exists.
  
       JavaScript activates scrolling only when:
  
       1. Screen <= 600px
       2. Text is wider than available space
    =================================================== */

    function marqueeHTML(
        text,
        modifier = ""
    ) {

        return `
      <span class="dev-marquee ${modifier}">

        <span class="dev-marquee__text">
          ${escapeHTML(text)}
        </span>

      </span>
    `;

    }


    /* ===================================================
       SKILLS
    =================================================== */

    function createSkillsHTML() {

        return developer.skills

            .map(
                (
                    skill,
                    index
                ) => {

                    const number =
                        String(index + 1)
                            .padStart(
                                2,
                                "0"
                            );


                    return `
            <span class="dev-skill">

              <i>
                ${number}
              </i>

              <span>
                ${escapeHTML(skill)}
              </span>

            </span>
          `;

                }
            )

            .join("");

    }


    /* ===================================================
       HIGHLIGHTS
    =================================================== */

    function createHighlightsHTML() {

        return developer.highlights

            .map(
                highlight => {

                    return `
            <span class="dev-highlight">

              <strong>
                ${escapeHTML(
                        highlight.value
                    )}
              </strong>

              <small>
                ${escapeHTML(
                        highlight.label
                    )}
              </small>

            </span>
          `;

                }
            )

            .join("");

    }


    /* ===================================================
       CONTACT FACTORY
    =================================================== */

    function createContactHTML({
        type,
        href,
        label,
        value,
        marqueeClass,
        icon
    }) {

        return `
      <a
        href="${escapeAttribute(href)}"
        class="dev-contact dev-contact--${type}"
        aria-label="${escapeAttribute(label)}"
      >

        <span class="dev-contact__icon">

          ${icon}

        </span>


        <span class="dev-contact__content">

          <small>
            ${type.toUpperCase()}
          </small>


          ${marqueeHTML(
            value,
            marqueeClass
        )}

        </span>


        <span
          class="dev-contact__arrow"
          aria-hidden="true"
        >
          ↗
        </span>

      </a>
    `;

    }


    /* ===================================================
       ICONS
    =================================================== */

    const phoneIcon = `
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <path
        d="
          M22 16.92v3
          a2 2 0 0 1-2.18 2
          19.79 19.79 0 0 1-8.63-3.07
          19.5 19.5 0 0 1-6-6
          A19.79 19.79 0 0 1 2.12 4.18
          2 2 0 0 1 4.11 2h3
          a2 2 0 0 1 2 1.72
          c.12.9.33 1.78.62 2.63
          a2 2 0 0 1-.45 2.11
          L8 9.73
          a16 16 0 0 0 6 6
          l1.27-1.27
          a2 2 0 0 1 2.11-.45
          c.85.29 1.73.5 2.63.62
          A2 2 0 0 1 22 16.92z
        "
      />

    </svg>
  `;


    const emailIcon = `
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <path
        d="
          M4 4h16
          a2 2 0 0 1 2 2v12
          a2 2 0 0 1-2 2H4
          a2 2 0 0 1-2-2V6
          a2 2 0 0 1 2-2z
        "
      />

      <path
        d="
          m22 6-10 7L2 6
        "
      />

    </svg>
  `;


    /* ===================================================
       CREATE COMPONENT
    =================================================== */

    const signature =
        document.createElement(
            "section"
        );


    signature.id =
        "devSignature";


    signature.className =
        "dev-signature";


    signature.setAttribute(
        "aria-label",
        `Website designed and engineered by ${developer.name}`
    );


    /* ===================================================
       BUILD HTML
    =================================================== */

    signature.innerHTML = `

    <div
      class="dev-signature__glow"
      aria-hidden="true"
    ></div>



    <!-- ===============================================
         PERMANENT HEADER
    ================================================ -->

    <button
      type="button"
      class="dev-signature__toggle"
      id="devSignatureToggle"
      aria-expanded="false"
      aria-controls="devSignatureDetails"
    >


      <!-- CODE ICON -->

      <span
        class="dev-signature__mini-icon"
        aria-hidden="true"
      >

        <span>&lt;</span>

        <b>/</b>

        <span>&gt;</span>

      </span>



      <!-- MINI IDENTITY -->

      <span
        class="dev-signature__mini-info"
      >

        <small>
          DESIGNED &amp; ENGINEERED BY
        </small>


        ${marqueeHTML(
        developer.name,
        "dev-marquee--name dev-marquee--mini-name"
    )}


        <span
          class="dev-signature__mini-title"
        >
          ${escapeHTML(
        developer.title
    )}
        </span>

      </span>



      <!-- SAME + / × BUTTON -->

      <span
        class="dev-signature__expand"
        aria-hidden="true"
      >

        <i></i>

        <i></i>

      </span>

    </button>



    <!-- ===============================================
         EXPANDED DETAILS
    ================================================ -->

    <div
      class="dev-signature__details"
      id="devSignatureDetails"
      aria-hidden="true"
    >

      <div
        class="dev-signature__details-inner"
      >



        <!-- ===========================================
             TERMINAL
        ============================================ -->

        <div
          class="dev-signature__terminal"
        >


          <div
            class="dev-signature__terminal-head"
          >


            <div
              class="dev-terminal-dots"
              aria-hidden="true"
            >

              <span></span>

              <span></span>

              <span></span>

            </div>


            <small>
              developer.profile
            </small>


            <span
              class="dev-terminal-status"
            >

              <i></i>

              ONLINE

            </span>

          </div>



          <!-- CODE PROFILE -->

          <div
            class="dev-signature__code"
          >

            <div>

              <span class="dev-code-key">
                const
              </span>

              <span class="dev-code-name">
                developer
              </span>

              <span class="dev-code-symbol">
                = {
              </span>

            </div>

            <!--
            <div class="dev-code-line" >

              <span class="dev-code-property">
                experience
              </span>

              <span class="dev-code-symbol">
                :
              </span>

              <span class="dev-code-string">
                "${escapeHTML(
        developer.experience
    )}"
              </span>

              <span class="dev-code-symbol">
                ,
              </span>

            </div>


            <div
              class="dev-code-line"
            >

              <span class="dev-code-property">
                focus
              </span>

              <span class="dev-code-symbol">
                :
              </span>

              <span class="dev-code-string">
                "Full-Stack • Automation • Robotics"
              </span>

            </div>


            <div
              class="dev-code-symbol"
            >
              };
            </div>
            -->

          </div>

        </div>



        <!-- ===========================================
             PROFILE
        ============================================ -->

        <div
          class="dev-signature__main"
        >


          <div
            class="dev-signature__avatar"
            aria-hidden="true"
          >

            <span>&lt;</span>

            <b>/</b>

            <span>&gt;</span>

          </div>



          <div
            class="dev-signature__identity"
          >

            <span
              class="dev-signature__eyebrow"
            >
              FULL-STACK • AUTOMATION • ROBOTICS
            </span>


            <div
              class="dev-signature__name-line"
            >

              ${marqueeHTML(
        developer.name,
        "dev-marquee--name"
    )}

            </div>


            <p>

              ${escapeHTML(
        developer.title
    )}

              <span>
                •
              </span>

              ${escapeHTML(
        developer.specialty
    )}

            </p>

          </div>



          <!-- =========================================
               PROFESSIONAL HIGHLIGHTS
          ========================================== -->

          <div
            class="dev-highlights"
          >

            ${createHighlightsHTML()}

          </div>



          <!-- =========================================
               SKILLS
          ========================================== -->

          <div
            class="dev-skills"
            id="devSkills"
            aria-label="Developer skills"
          >

            <div
              class="dev-skills__track"
            >

              ${createSkillsHTML()}

            </div>

          </div>

        </div>



        <!-- ===========================================
             CONTACTS
        ============================================ -->

        <div
          class="dev-signature__contact"
        >


          ${createContactHTML({

        type:
            "phone",

        href:
            `tel:${developer.phoneLink}`,

        label:
            `Call ${developer.name}`,

        value:
            developer.phoneDisplay,

        marqueeClass:
            "dev-marquee--phone",

        icon:
            phoneIcon

    })}



          ${createContactHTML({

        type:
            "email",

        href:
            `mailto:${developer.email}`,

        label:
            `Email ${developer.name}`,

        value:
            developer.email,

        marqueeClass:
            "dev-marquee--email",

        icon:
            emailIcon

    })}

        </div>



        <!-- ===========================================
             BOTTOM
        ============================================ -->

        <div
          class="dev-signature__footer"
        >


          <div
            class="dev-signature__status"
          >

            <span
              class="dev-status-dot"
              aria-hidden="true"
            ></span>


            <span>
              Crafted with precision
            </span>

          </div>



          <div
            class="dev-signature__footer-code"
          >

            <code>
              };
            </code>


            <span
              class="dev-cursor"
              aria-hidden="true"
            ></span>

          </div>

        </div>


      </div>

    </div>

  `;



    /* ===================================================
       INSERT INTO PAGE
  
       Priority:
  
       1. [data-dev-signature]
       2. footer
       3. body
    =================================================== */

    const target =
        document.querySelector(
            "[data-dev-signature]"
        ) ||
        document.querySelector(
            "footer"
        ) ||
        document.body;


    target.appendChild(
        signature
    );



    /* ===================================================
       REFERENCES
    =================================================== */

    const toggle =
        signature.querySelector(
            "#devSignatureToggle"
        );


    const details =
        signature.querySelector(
            "#devSignatureDetails"
        );


    const detailsInner =
        signature.querySelector(
            ".dev-signature__details-inner"
        );


    const skills =
        signature.querySelector(
            "#devSkills"
        );


    const marquees =
        Array.from(
            signature.querySelectorAll(
                ".dev-marquee"
            )
        );



    /* ===================================================
       STATE
    =================================================== */

    let isExpanded =
        false;


    const phoneMedia =
        window.matchMedia(
            "(max-width: 600px)"
        );


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );



    /* ===================================================
       MARQUEE
  
       ONLY:
  
       - phone
       - text does not fit
       - reduced motion disabled
    =================================================== */

    function updateMarquees() {

        const isPhone =
            phoneMedia.matches;


        marquees.forEach(
            marquee => {

                const text =
                    marquee.querySelector(
                        ".dev-marquee__text"
                    );


                if (!text) {
                    return;
                }


                marquee.classList.remove(
                    "is-overflowing"
                );


                marquee.style.setProperty(
                    "--dev-marquee-distance",
                    "0px"
                );


                marquee.style.removeProperty(
                    "--dev-marquee-duration"
                );


                /*
                 * Desktop / tablet:
                 * never animate.
                 */

                if (!isPhone) {
                    return;
                }


                if (
                    reducedMotion.matches
                ) {
                    return;
                }


                const availableWidth =
                    marquee.clientWidth;


                const textWidth =
                    text.scrollWidth;


                if (
                    availableWidth <= 0 ||
                    textWidth <= 0
                ) {
                    return;
                }


                const overflow =
                    textWidth -
                    availableWidth;


                /*
                 * Full text already fits.
                 */

                if (
                    overflow <= 2
                ) {
                    return;
                }


                const distance =
                    overflow + 3;


                const duration =
                    Math.min(
                        9,
                        Math.max(
                            5.5,
                            5.5 +
                            distance / 35
                        )
                    );


                marquee.style.setProperty(
                    "--dev-marquee-distance",
                    `-${distance}px`
                );


                marquee.style.setProperty(
                    "--dev-marquee-duration",
                    `${duration}s`
                );


                marquee.classList.add(
                    "is-overflowing"
                );

            }
        );

    }



    /* ===================================================
       OPEN COMPONENT
  
       Uses real height rather than max-height.
  
       This gives an exact animation.
    =================================================== */

    function openSignature() {

        if (isExpanded) {
            return;
        }


        isExpanded =
            true;


        signature.classList.add(
            "is-expanded"
        );


        toggle.setAttribute(
            "aria-expanded",
            "true"
        );


        details.setAttribute(
            "aria-hidden",
            "false"
        );

        // keep scroll to bottom till expanding animation ends about 1s, and keep scroll each 100ms till animation ends
        const scrollInterval = setInterval(() => {
            // fix the osilation of scroll
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                clearInterval(scrollInterval);
            }
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        }, 50);
        setTimeout(() => {
            clearInterval(scrollInterval);
        }, 1000);


        /*
         * Start at zero.
         */

        details.style.height =
            "0px";


        /*
         * Reset skill rail.
         */

        if (skills) {

            skills.scrollLeft =
                0;


            skillsDirection =
                1;


            pauseSkills(
                900
            );

        }


        requestAnimationFrame(
            () => {

                updateMarquees();


                details.style.height =
                    `${detailsInner.scrollHeight}px`;

            }
        );


    }



    /* ===================================================
       CLOSE COMPONENT
  
       Converts "auto" height back into its exact
       pixel height before animating to zero.
  
       This fixes the component remaining too tall.
    =================================================== */

    function closeSignature() {

        if (!isExpanded) {
            return;
        }


        const currentHeight =
            details.getBoundingClientRect()
                .height;


        details.style.height =
            `${currentHeight}px`;


        /*
         * Force browser reflow.
         */

        void details.offsetHeight;


        isExpanded =
            false;


        signature.classList.remove(
            "is-expanded"
        );


        toggle.setAttribute(
            "aria-expanded",
            "false"
        );


        details.setAttribute(
            "aria-hidden",
            "true"
        );


        requestAnimationFrame(
            () => {

                details.style.height =
                    "0px";

            }
        );

    }



    /* ===================================================
       TOGGLE WITH SAME BUTTON
    =================================================== */

    toggle.addEventListener(
        "click",
        () => {

            if (isExpanded) {

                closeSignature();

            } else {

                openSignature();

            }

        }
    );



    /* ===================================================
       DETAILS TRANSITION FINISHED
    =================================================== */

    details.addEventListener(
        "transitionend",
        event => {

            if (
                event.propertyName !==
                "height"
            ) {
                return;
            }


            /*
             * Once fully open,
             * use auto height so content stays responsive.
             */

            if (isExpanded) {

                details.style.height =
                    "auto";

            } else {

                details.style.height =
                    "0px";

            }

        }
    );



    /* ===================================================
       ESCAPE CLOSES
    =================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                isExpanded
            ) {

                closeSignature();


                toggle.focus();

            }

        }
    );



    /* ===================================================
       SKILLS AUTO SCROLLER
    =================================================== */

    let skillsDirection =
        1;


    let skillsLastFrame =
        performance.now();


    let skillsPauseUntil =
        0;


    let skillsDragging =
        false;


    let dragPointerId =
        null;


    let dragStartX =
        0;


    let dragStartScroll =
        0;



    function pauseSkills(
        milliseconds = 3000
    ) {

        skillsPauseUntil =
            performance.now() +
            milliseconds;

    }



    /* ===================================================
       AUTO MOVE
  
       Real scrollLeft.
  
       No duplicated skills.
       No fake transform.
       No empty ending.
    =================================================== */

    function animateSkills(now) {

        if (!skills) {
            return;
        }


        const elapsed =
            Math.min(
                40,
                now -
                skillsLastFrame
            );


        skillsLastFrame =
            now;


        const maxScroll =
            Math.max(
                0,
                skills.scrollWidth -
                skills.clientWidth
            );


        const canMove =
            isExpanded &&
            !reducedMotion.matches &&
            !skillsDragging &&
            now >= skillsPauseUntil &&
            maxScroll > 1;


        if (canMove) {

            const speed =
                phoneMedia.matches
                    ? 18
                    : 22;


            let nextPosition =
                skills.scrollLeft +
                (
                    skillsDirection *
                    speed *
                    (
                        elapsed / 1000
                    )
                );


            /*
             * RIGHT EDGE
             */

            if (
                nextPosition >=
                maxScroll
            ) {

                nextPosition =
                    maxScroll;


                skillsDirection =
                    -1;


                skillsPauseUntil =
                    now + 700;

            }


            /*
             * LEFT EDGE
             */

            if (
                nextPosition <= 0
            ) {

                nextPosition =
                    0;


                skillsDirection =
                    1;


                skillsPauseUntil =
                    now + 700;

            }


            skills.scrollLeft =
                nextPosition;

        }


        requestAnimationFrame(
            animateSkills
        );

    }



    /* ===================================================
       DESKTOP MOUSE DRAG
    =================================================== */

    function startSkillDrag(event) {

        pauseSkills(
            5000
        );


        /*
         * Phones use native touch swipe.
         */

        if (
            event.pointerType !==
            "mouse"
        ) {
            return;
        }


        skillsDragging =
            true;


        dragPointerId =
            event.pointerId;


        dragStartX =
            event.clientX;


        dragStartScroll =
            skills.scrollLeft;


        skills.classList.add(
            "is-dragging"
        );


        skills.setPointerCapture(
            event.pointerId
        );

    }



    function moveSkillDrag(event) {

        if (
            !skillsDragging ||
            event.pointerId !==
            dragPointerId
        ) {
            return;
        }


        const distance =
            event.clientX -
            dragStartX;


        const maxScroll =
            Math.max(
                0,
                skills.scrollWidth -
                skills.clientWidth
            );


        const next =
            dragStartScroll -
            distance;


        skills.scrollLeft =
            Math.max(
                0,
                Math.min(
                    next,
                    maxScroll
                )
            );


        pauseSkills(
            5000
        );

    }



    function stopSkillDrag(event) {

        if (!skillsDragging) {
            return;
        }


        if (
            event &&
            dragPointerId !== null &&
            event.pointerId !==
            dragPointerId
        ) {
            return;
        }


        skillsDragging =
            false;


        dragPointerId =
            null;


        skills.classList.remove(
            "is-dragging"
        );


        pauseSkills(
            2500
        );

    }



    /* ===================================================
       DESKTOP MOUSE WHEEL
    =================================================== */

    function handleSkillsWheel(event) {

        const maxScroll =
            Math.max(
                0,
                skills.scrollWidth -
                skills.clientWidth
            );


        if (
            maxScroll <= 0
        ) {
            return;
        }


        const movement =
            Math.abs(
                event.deltaX
            ) >
                Math.abs(
                    event.deltaY
                )

                ? event.deltaX

                : event.deltaY;


        const atStart =
            skills.scrollLeft <= 1;


        const atEnd =
            skills.scrollLeft >=
            maxScroll - 1;


        const wantsLeft =
            movement < 0;


        const wantsRight =
            movement > 0;


        const canMove =
            (
                wantsLeft &&
                !atStart
            ) ||
            (
                wantsRight &&
                !atEnd
            );


        /*
         * Let the normal page scroll when
         * the skills are already at the edge.
         */

        if (!canMove) {
            return;
        }


        event.preventDefault();


        const next =
            skills.scrollLeft +
            movement;


        skills.scrollLeft =
            Math.max(
                0,
                Math.min(
                    next,
                    maxScroll
                )
            );


        pauseSkills(
            2500
        );

    }



    /* ===================================================
       SKILL EVENTS
    =================================================== */

    if (skills) {

        skills.addEventListener(
            "pointerdown",
            startSkillDrag
        );


        skills.addEventListener(
            "pointermove",
            moveSkillDrag
        );


        skills.addEventListener(
            "pointerup",
            stopSkillDrag
        );


        skills.addEventListener(
            "pointercancel",
            stopSkillDrag
        );


        skills.addEventListener(
            "touchstart",
            () => {

                pauseSkills(
                    5000
                );

            },
            {
                passive: true
            }
        );


        skills.addEventListener(
            "touchend",
            () => {

                pauseSkills(
                    2500
                );

            },
            {
                passive: true
            }
        );


        skills.addEventListener(
            "wheel",
            handleSkillsWheel,
            {
                passive: false
            }
        );


        skills.addEventListener(
            "mouseenter",
            () => {

                pauseSkills(
                    5000
                );

            }
        );


        skills.addEventListener(
            "mouseleave",
            () => {

                pauseSkills(
                    1500
                );

            }
        );

    }



    /* ===================================================
       RESIZE
    =================================================== */

    function handleResize() {

        updateMarquees();


        if (!skills) {
            return;
        }


        const maxScroll =
            Math.max(
                0,
                skills.scrollWidth -
                skills.clientWidth
            );


        if (
            skills.scrollLeft >
            maxScroll
        ) {

            skills.scrollLeft =
                maxScroll;

        }

    }


    window.addEventListener(
        "resize",
        handleResize
    );


    if (
        typeof phoneMedia.addEventListener ===
        "function"
    ) {

        phoneMedia.addEventListener(
            "change",
            handleResize
        );

    }



    /* ===================================================
       RESIZE OBSERVER
    =================================================== */

    if (
        "ResizeObserver" in window
    ) {

        const resizeObserver =
            new ResizeObserver(
                updateMarquees
            );


        resizeObserver.observe(
            signature
        );

    }



    /* ===================================================
       INITIAL STATE
    =================================================== */

    details.style.height =
        "0px";


    requestAnimationFrame(
        updateMarquees
    );


    requestAnimationFrame(
        animateSkills
    );

})();