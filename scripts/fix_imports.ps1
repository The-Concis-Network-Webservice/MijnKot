$files = Get-ChildItem -Path "c:\Users\lande\Documents\Newfolder\projectsMax\projects\KotWebsite\src" -Recurse -Include *.ts,*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Replace components imports
    $content = $content -replace 'from\s+["''](\.\./|@/)+components', 'from "@/shared/ui'
    
    # Replace lib imports
    $content = $content -replace 'from\s+["''](\.\./|@/)+lib', 'from "@/shared/lib'

    # Replace types imports
    $content = $content -replace 'from\s+["''](\.\./|@/)+types', 'from "@/types'
    
    # Replace db imports
    $content = $content -replace 'from\s+["''](\.\./|@/)+db', 'from "@/db'
    
    # Replace utils if exists (often bundled with lib)
    $content = $content -replace 'from\s+["''](\.\./|@/)+utils', 'from "@/shared/lib'

    if ($content -ne $originalContent) {
        Write-Host "Updating $($file.Name)"
        $content | Set-Content $file.FullName
    }
}
