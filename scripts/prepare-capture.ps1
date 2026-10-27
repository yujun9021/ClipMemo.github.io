param([ValidateSet('cream','navy')][string]$Theme = 'cream')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName PresentationFramework,PresentationCore,WindowsBase
$root = Split-Path -Parent $PSScriptRoot
$data = Join-Path $root ('.capture\' + $Theme)
if (Test-Path (Join-Path $data 'state.json')) { throw 'Capture workspace already exists; preserve it and use the existing workspace.' }
New-Item -ItemType Directory -Force (Join-Path $data 'notes'),(Join-Path $data 'images'),(Join-Path $root 'public\images') | Out-Null

# Original vector sample artwork, rendered for the sample memo. No user files used.
$drawing = New-Object Windows.Media.DrawingVisual
$dc = $drawing.RenderOpen()
$dc.DrawRectangle([Windows.Media.BrushConverter]::new().ConvertFromString('#DCECE9'),$null,[Windows.Rect]::new(0,0,640,340))
$dc.DrawEllipse([Windows.Media.BrushConverter]::new().ConvertFromString('#F8D789'),$null,[Windows.Point]::new(488,87),38,38)
$geometry = [Windows.Media.Geometry]::Parse('M0,260 C140,120 245,165 355,268 C470,140 565,180 640,235 L640,340 L0,340 Z')
$dc.DrawGeometry([Windows.Media.BrushConverter]::new().ConvertFromString('#8AA596'),$null,$geometry)
$geometry = [Windows.Media.Geometry]::Parse('M0,300 C160,225 250,280 350,295 C455,225 535,255 640,275 L640,340 L0,340 Z')
$dc.DrawGeometry([Windows.Media.BrushConverter]::new().ConvertFromString('#4D746C'),$null,$geometry)
$dc.Close()
$bitmap = New-Object Windows.Media.Imaging.RenderTargetBitmap(640,340,96,96,[Windows.Media.PixelFormats]::Pbgra32)
$bitmap.Render($drawing)
$encoder = New-Object Windows.Media.Imaging.PngBitmapEncoder
$encoder.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
$art = Join-Path $data 'weekend.png'
$stream = [IO.File]::Create($art); $encoder.Save($stream); $stream.Dispose()
$id1='11111111111111111111111111111111';$id2='22222222222222222222222222222222';$id3='33333333333333333333333333333333';$wid='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
$xmlns='xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"'
$documents = @(
 @{Id=$id1;Title='오늘의 작은 목표';Text="오늘의 작은 목표`n☑ 아침 산책 다녀오기`n☐ 아이디어 한 줄 적기`n☐ 읽고 싶던 책 10쪽`n☐ 오늘의 기록 남기기";Body='<Paragraph FontSize="23" FontWeight="Bold" Margin="0,3,0,19">조금씩, 꾸준히.</Paragraph><Paragraph Margin="0,0,0,18">바쁜 하루에도 나를 위한 시간을.</Paragraph><Paragraph Margin="0,0,0,16">☑ 아침 산책 다녀오기</Paragraph><Paragraph Margin="0,0,0,16">☐ 아이디어 한 줄 적기</Paragraph><Paragraph Margin="0,0,0,16">☐ 읽고 싶던 책 10쪽</Paragraph><Paragraph Margin="0,0,0,26">☐ 오늘의 기록 남기기</Paragraph><Paragraph FontSize="12">완벽하지 않아도 괜찮아요.</Paragraph>'},
 @{Id=$id2;Title='문득 떠오른 생각';Text="문득 떠오른 생각`n좋은 생각은 늘 갑자기.`n놓치기 전에 여기에 담아두기.";Body='<Paragraph FontSize="22" FontWeight="Bold" Margin="0,3,0,17">좋은 생각은 늘 갑자기.</Paragraph><Paragraph Margin="0,0,0,16">놓치기 전에 여기에 담아두기.</Paragraph><Paragraph Margin="0,0,0,12">• 다음 프로젝트의 첫 아이디어</Paragraph><Paragraph Margin="0,0,0,12">• 나중에 다시 보고 싶은 문장</Paragraph><Paragraph>• 잊기 싫은 아주 작은 것들</Paragraph>'},
 @{Id=$id3;Title='이번 주말에는';Text="이번 주말에는`n잠깐, 쉬어가기.`n가까운 곳에서 느리게 걷기.";Body=('<Paragraph FontSize="21" FontWeight="Bold" Margin="0,0,0,12">잠깐, 쉬어가기.</Paragraph><Paragraph Margin="0,0,0,12"><InlineUIContainer><Image Source="' + $art.Replace('\','/') + '" Width="270" Height="143.44" /></InlineUIContainer></Paragraph><Paragraph>가까운 곳에서 느리게 걷기.</Paragraph>')}
)
foreach($d in $documents){
 $body = $d.Body
 if ($Theme -eq 'navy') { $body = $body.Replace('<Paragraph', '<Paragraph Foreground="#E7EFF5"') }
 $xml='<FlowDocument '+$xmlns+' FontFamily="Malgun Gothic" FontSize="15" PagePadding="0">'+$body+'</FlowDocument>'
 $doc=[Windows.Markup.XamlReader]::Parse($xml)
 $range=New-Object Windows.Documents.TextRange($doc.ContentStart,$doc.ContentEnd)
 $stream=[IO.File]::Create((Join-Path $data ('notes\'+$d.Id+'.xamlpackage')))
 $range.Save($stream,[Windows.DataFormats]::XamlPackage);$stream.Dispose()
}
$stamp='/Date('+[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()+')/'
$clips=@(
 @{Id='44444444444444444444444444444444';Kind='text';Text='작은 생각이 모여 새로운 하루가 됩니다.';Hash='SAMPLE-TEXT-1';Created=$stamp;Pinned=$true},
 @{Id='55555555555555555555555555555555';Kind='text';Text="오늘 기억할 것`n서두르지 않고, 하나씩.";Hash='SAMPLE-TEXT-2';Created=$stamp;Pinned=$false}
)
$notes=@($documents | ForEach-Object { @{Id=$_.Id;Title=$_.Title;Text=$_.Text;Updated=$stamp;Caret=0;ChecklistMode=$false} })
$layout=@{Axis='x';Ratio=.48;First=@{NoteId=$id1;Ratio=.5};Second=@{Axis='y';Ratio=.49;First=@{NoteId=$id2;Ratio=.5};Second=@{NoteId=$id3;Ratio=.5}}}
$state=@{Version=1;Notes=$notes;Clips=$clips;Windows=@(@{Id=$wid;Left=60;Top=60;Width=1140;Height=710;Sidebar=$true;Active=$id2;Root=$layout});LastWindow=$wid;CapturePaused=$true;ClipboardOpen=($Theme -eq 'cream');AutoStart=$false;HotModifiers=7;HotKey=123;ReturnModifiers=0;ReturnKey=27;MemoThemeId=$Theme}
$serialized = ($state | ConvertTo-Json -Depth 12).Replace('"/Date(', '"\/Date(').Replace(')/"', ')\/"')
[IO.File]::WriteAllText((Join-Path $data 'state.json'),$serialized,[Text.UTF8Encoding]::new($false))
Write-Output $data
