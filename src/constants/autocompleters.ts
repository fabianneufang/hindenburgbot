import { Autocomplete } from "../@types/command";
import { matchSorter } from "match-sorter";

export const bulkRoleList: Autocomplete = (query, interaction, document) => {
    if (!document.bulkRoles || !document.bulkRoles.length) return Promise.resolve([{name: "Error: No bulk roles. Create one first.", value: "error"}]);

    const bulkRolesFilteredAndSortedByRelevance = matchSorter((document.bulkRoles.map(e => ({name: e.name, role: e.roleId}))), `${query}`, { keys: ["name", "role"] });

    return Promise.resolve(bulkRolesFilteredAndSortedByRelevance.map(({name, role}) => ({name: name, value: role})))
}

export const activityList: Autocomplete = (query, interaction) => {
    if (!interaction.guild) return Promise.resolve([{name: "Error: No guild.", value: "error"}]);

    const allActivities = {
        none: [
            {
                "name": "Watch Together",
                "value": "880218394199220334"
            },
            {
                "name": "Sketch Heads (new Doodle Crew)",
                "value": "902271654783242291"
            },
            {
                "name": "Word Snacks",
                "value": "879863976006127627"
            },
            {
                "name": "Betrayal.io",
                "value": "773336526917861400"
            },
            {
                "name": "Fishington.io",
                "value": "814288819477020702"
            },
        ],
        tier1: [
            {
                "name": "Poker Night (Requires Boost Level 1)",
                "value": "755827207812677713"
            },
            {
                "name": "Chess In The Park (Requires Boost Level 1)",
                "value": "832012774040141894"
            },
            {
                "name": "Checkers In The Park (Requires Boost Level 1)",
                "value": "832013003968348200"
            },
            {
                "name": "Ocho (New!) (Requires Boost Level 1)",
                "value": "832025144389533716"
            },
            {
                "name": "Letter League (formerly Letter Tile) (Requires Boost Level 1)",
                "value": "879863686565621790"
            },
            {
                "name": "SpellCast (Requires Boost Level 1)",
                "value": "852509694341283871"
            }
        ]
    }
    const activities = [
        ...allActivities.none,
        ...(interaction.guild.premiumTier === "TIER_1" ? allActivities.tier1 : []),
        ...(interaction.guild.premiumTier === "TIER_2" ? [...allActivities.tier1] : []),
        ...(interaction.guild.premiumTier === "TIER_3" ? [...allActivities.tier1] : [])
    ]

    const activitiesFilteredAndSortedByRelevance = matchSorter((activities.map(e => ({name: e.name, value: e.value}))), `${query}`, { keys: ["name"] });

    return Promise.resolve(activitiesFilteredAndSortedByRelevance.map(({name, value}) => ({name: name, value: value})))
}
