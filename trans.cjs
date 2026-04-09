const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/shared/lib/i18n/en.json');
const nlPath = path.join(__dirname, 'src/shared/lib/i18n/nl.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const nl = JSON.parse(fs.readFileSync(nlPath, 'utf8'));

const transEn = {
    hero: {
        badge: "Student Housing - Leuven",
        title: "Quality living,",
        title_highlight: "without the hassle.",
        desc: "Mijn-Kot offers furnished student rooms and studios in Leuven. With the official KU Leuven Kotlabel, certified fire safety and direct contact with the owner - transparent and honest.",
        btn_rooms: "View available rooms",
        btn_visit: "Book a free visit"
    },
    stats: {
        buildings: "Buildings in Leuven",
        kotlabel: "Kotlabel certified",
        fire: "Fire-safety certified",
        fees: "Agency fees"
    },
    story: {
        label: "Our Story",
        title: "Student housing with a human touch",
        p1: "Mijn-Kot rents quality student rooms and studios in Leuven. We manage four buildings in prime locations - in the bustling city center and quiet Heverlee.",
        p2: "What sets us apart? We are not an agency. You rent directly from the owner - fast, fair and without hidden costs. All our rooms are furnished, fire-safe certified and bear the official ",
        p2_strong: "KU Leuven Kotlabel.",
        p3: "We work closely with the KU Leuven Housing Service and provide professional maintenance via our own handyman. If there is an issue, we solve it."
    },
    features: {
        f1_title: "KU Leuven Kotlabel",
        f1_desc: "Official quality label for comfort and safety",
        f2_title: "Fire safety",
        f2_desc: "Certified by the Leuven fire department",
        f3_title: "Furnished",
        f3_desc: "Rooms from 12-31 m2, studios up to 50 m2",
        f4_title: "In-house maintenance",
        f4_desc: "Fast follow-up on technical issues"
    },
    values: {
        label: "Why Mijn-Kot",
        title: "Our promises to you",
        items: [
            {
                title: "Fully fire-safe",
                desc: "Every room meets the safety regulations of the Leuven fire department. Your safety is our priority."
            },
            {
                title: "KU Leuven Kotlabel",
                desc: "Our rooms bear the official quality label of KU Leuven - a guarantee for comfort, safety and value."
            },
            {
                title: "Direct owner contact",
                desc: "No middlemen, no agency fees. You rent directly from us - fast, transparent and personal."
            },
            {
                title: "In-house maintenance",
                desc: "A dedicated handyman provides quick maintenance. Small problems are usually solved within a day."
            }
        ]
    },
    steps: {
        label: "Step-by-step",
        title: "From searching to moving in 4 steps",
        btn: "Book a free viewing now",
        btn_sub: "Free - No obligations - Instant confirmation",
        items: [
            {
                title: "View our offer",
                desc: "Browse through our rooms and studios in Leuven. Filter by type, location and price."
            },
            {
                title: "Plan a free visit",
                desc: "Book a viewing online - free, without obligations and instantly confirmed. You choose the time."
            },
            {
                title: "Sign digitally",
                desc: "Your rental agreement is drawn up and signed digitally. Fast, secure and legally binding."
            },
            {
                title: "Move in!",
                desc: "Receive your keys and start your student life in a high-quality, fully furnished room."
            }
        ]
    },
    locations: {
        label: "Locations",
        title: "Our buildings in Leuven",
        desc: "Four buildings in prime locations - centrally located in the city and quiet in Heverlee, always close to KU Leuven.",
        btn_view: "View",
        btn_all: "View all locations and available rooms"
    },
    contact: {
        title: "Questions? We are happy to help.",
        desc: "Send an email to Dominique or schedule a viewing immediately. We answer quickly and personally.",
        btn_contact: "Contact form",
        btn_visit: "Schedule a viewing"
    }
};

const transNl = {
    hero: {
        badge: "Studentenhuisvesting - Leuven",
        title: "Kwalitatief wonen,",
        title_highlight: "zonder gedoe.",
        desc: "Mijn-Kot biedt gemeubelde studentenkamers en studio's in Leuven. Met het officiële KU Leuven Kotlabel, gecertificeerde brandveiligheid en direct contact met de eigenaar - transparant en eerlijk.",
        btn_rooms: "Bekijk beschikbare kamers",
        btn_visit: "Gratis bezichtiging plannen"
    },
    stats: {
        buildings: "Gebouwen in Leuven",
        kotlabel: "Kotlabel gecertificeerd",
        fire: "Brandveilig gecertificeerd",
        fees: "Bemiddelingskosten"
    },
    story: {
        label: "Ons verhaal",
        title: "Studentenhuisvesting met een menselijk gezicht",
        p1: "Mijn-Kot verhuurt kwalitatieve studentenkamers en studio's in Leuven. We beheren vier gebouwen op toplocaties - in het bruisende stadscentrum en het rustige Heverlee.",
        p2: "Wat ons onderscheidt? Wij zijn geen bemiddelingskantoor. Je huurt rechtstreeks bij de eigenaar - snel, eerlijk en zonder verborgen kosten. Al onze kamers zijn gemeubeld, brandveilig gecertificeerd en dragen het officiële ",
        p2_strong: "KU Leuven Kotlabel.",
        p3: "We werken nauw samen met de Kotendienst van KU Leuven en zorgen voor professioneel onderhoud via een eigen klusjesman. Als er iets is, lossen we het op."
    },
    features: {
        f1_title: "KU Leuven Kotlabel",
        f1_desc: "Officieel kwaliteitslabel voor comfort en veiligheid",
        f2_title: "Brandveiligheid",
        f2_desc: "Gecertificeerd door brandweer Leuven",
        f3_title: "Gemeubeld",
        f3_desc: "Kamers van 12-31 m2, studio's tot 50 m2",
        f4_title: "Eigen onderhoud",
        f4_desc: "Snelle opvolging bij technische problemen"
    },
    values: {
        label: "Waarom Mijn-Kot",
        title: "Onze beloftes aan jou",
        items: [
            {
                title: "Volledig brandveilig",
                desc: "Elke kamer voldoet aan de veiligheidsvoorschriften van de brandweer Leuven. Jouw veiligheid is onze prioriteit."
            },
            {
                title: "KU Leuven Kotlabel",
                desc: "Onze kamers dragen het officiële kwaliteitslabel van KU Leuven - een garantie voor comfort, veiligheid en prijs-kwaliteit."
            },
            {
                title: "Direct contact met eigenaar",
                desc: "Geen tussenpersonen, geen bemiddelingskosten. Je huurt rechtstreeks bij ons - snel, transparant en persoonlijk."
            },
            {
                title: "Eigen onderhoudsdienst",
                desc: "Een vaste klusjesman staat in voor snel onderhoud. Kleine problemen worden doorgaans binnen de dag opgelost."
            }
        ]
    },
    steps: {
        label: "Stappenplan",
        title: "Van zoeken naar intrekken in 4 stappen",
        btn: "Plan nu een gratis bezichtiging",
        btn_sub: "Gratis - Vrijblijvend - Direct bevestiging",
        items: [
            {
                title: "Bekijk het aanbod",
                desc: "Blader door onze kamers en studio's in Leuven. Filter op type, locatie en prijs."
            },
            {
                title: "Plan een gratis bezichtiging",
                desc: "Boek online een bezichtiging - gratis, vrijblijvend en direct bevestigd. Je kiest zelf het moment."
            },
            {
                title: "Teken digitaal",
                desc: "Je huurovereenkomst wordt digitaal opgesteld en ondertekend. Snel, veilig en juridisch geldig."
            },
            {
                title: "Trek in!",
                desc: "Ontvang je sleutels en begin je studentenleven in een kwalitatief, volledig gemeubeld kot."
            }
        ]
    },
    locations: {
        label: "Locaties",
        title: "Onze gebouwen in Leuven",
        desc: "Vier gebouwen op toplocaties - centraal in de stad en rustig in Heverlee, altijd dicht bij KU Leuven.",
        btn_view: "Bekijk",
        btn_all: "Bekijk alle locaties en beschikbare kamers"
    },
    contact: {
        title: "Vragen? We helpen je graag.",
        desc: "Stuur een e-mail naar Dominique of plan meteen een bezichtiging. We antwoorden snel en persoonlijk.",
        btn_contact: "Contactformulier",
        btn_visit: "Bezichtiging plannen"
    }
};

en.over_ons = transEn;
nl.over_ons = transNl;

fs.writeFileSync(enPath, JSON.stringify(en, null, 4));
fs.writeFileSync(nlPath, JSON.stringify(nl, null, 4));

console.log('JSON updated successfully!');
