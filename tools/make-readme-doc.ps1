$ErrorActionPreference = 'Stop'
$outputPath = Join-Path (Get-Location) 'ReadMe.doc'
$wordApp = New-Object -ComObject Word.Application
$wordApp.Visible = $false
$wordApp.DisplayAlerts = 0
try {
    $wordDocument = $wordApp.Documents.Add()
    $wordDocument.Content.Text = @'
FANDOMVERSE - ASSUMPTIONS AND INSTALLATION

Competition: Web Innovation Unleashed
Project type: Independent, educational fan discovery single-page application.

INSTALLATION
Install Node.js 20.19+ or 22.12+ and npm. In this project folder, run npm install and npm run dev. Open the URL printed by Vite. For the production build, run npm run build and npm run preview. In Windows PowerShell with script execution disabled, use npm.cmd instead of npm. The preview serves the built site at approximately http://localhost:4173/.

ASSUMPTIONS
1. The seven required worlds are Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga. K-Pop profiles represent real artists/group members rather than fictional characters.
2. Factual local JSON and prices are an editorial snapshot verified 26 September 2026; recheck time-sensitive prices, events, and release dates before submission.
3. The temporary cart has no checkout or payment. Login and signup are clearly labelled demos without authentication or password storage. Visitor count is simulated locally.
4. Bookmarks persist in browser localStorage; personal notes live only in sessionStorage. No visitor change writes to bundled JSON.
5. Orbit is a scripted local FAQ/recommendation guide. It is not connected to a live AI API.
6. Public visibility does not give image reuse permission. Some cards use an explicit media-rights fallback and an official source link. Local reused assets and their credits are documented in docs/MEDIA-CREDITS.md.
7. Warriors Xtreme, Hassan Jahangir, Hassan Khan, Hassan Afridi, Shayan Shahnoor, hassanssk21@gmail.com, and DHA Karachi are participant-supplied public details in src/config/team.json. Verify spelling and consent before publishing.
8. FandomVerse is not an official rights-holder site or retailer. Purchases can only be considered on linked official retailer pages.
9. Static local preview cannot prove 24/7 hosted uptime or production capacity. External links, embeds, and a configured Google Map require internet.

DOCUMENTATION
docs/PROJECT-REPORT.md contains the problem definition, design, architecture, diagrams, test data/results, and installation instructions. docs/SRS-CHECKLIST.md tracks the PDF requirements. docs/WALKTHROUGH.md and docs/CODE-GUIDE.md help with the presentation and judge questions. submission/FandomVerse-demo.mp4 is the recorded browser demonstration.

AI ACKNOWLEDGEMENT
OpenAI Codex assisted with research organization, design, code, testing, documentation, and mentoring. The participant must review, understand, personalize, and validate the final submission.
'@
    # 0 = genuine Word 97-2003 binary document format.
    $wordDocument.SaveAs2($outputPath, 0)
    $wordDocument.Close($false)
}
finally {
    $wordApp.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($wordApp) | Out-Null
}
Write-Output $outputPath
