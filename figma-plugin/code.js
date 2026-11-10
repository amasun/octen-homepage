// Figma 官方沙盒执行脚本
(async () => {
  const selection = figma.currentPage.selection;
  if (!selection || selection.length === 0) {
    figma.notify("⚠️ 请先在画布上单击选中你的海报画板！", { error: true });
    figma.closePlugin();
    return;
  }

  const source = selection[0];
  if (source.type !== "FRAME" && source.type !== "COMPONENT" && source.type !== "INSTANCE") {
    figma.notify("⚠️ 选中的不是 Frame 画板，请选中海报的外层 Frame！", { error: true });
    figma.closePlugin();
    return;
  }

  figma.notify("⏳ 正在智能生成 3 个适配尺寸画板...");

  const createdFrames = [];

  // ==========================================
  // 1. 生成 1:1 Luma 封面 (1000 x 1000)
  // ==========================================
  const luma = source.clone();
  luma.name = "Cover - Luma (1:1)";
  luma.resize(1000, 1000);
  luma.x = source.x + source.width + 120;
  luma.y = source.y;

  // 上下分层调整
  const lumaLeftCard = luma.findOne(n => n.name.includes("427319373") || n.name.includes("Frame"));
  const lumaEyeBg = luma.findOne(n => n.name.includes("4635") || (n.width > 400 && n.x > 300));
  const lumaPixelGroup = luma.findOne(n => n.name.includes("1000004659") || n.name.includes("Group"));
  const lumaSubtitle = luma.findOne(n => n.type === "TEXT" && n.characters.includes("AI News"));

  if (lumaEyeBg) {
    lumaEyeBg.x = 0;
    lumaEyeBg.y = 0;
    lumaEyeBg.resize(1000, 520);
  }
  if (lumaLeftCard) {
    lumaLeftCard.x = 0;
    lumaLeftCard.y = 520;
    lumaLeftCard.resize(1000, 480);
    // 铺满绿底与墨绿条
    const greenBg = lumaLeftCard.findOne(n => n.name.includes("4651") || n.type === "RECTANGLE");
    if (greenBg) greenBg.resize(1000, 480);
    const darkBar = lumaLeftCard.findOne(n => n.name.includes("4636"));
    if (darkBar) {
      darkBar.x = 0;
      darkBar.y = 350;
      darkBar.resize(1000, 130);
    }
  }
  createdFrames.push(luma);

  // ==========================================
  // 2. 生成 16:9 X (Twitter) & LinkedIn 横版 (1200 x 675)
  // ==========================================
  const social = source.clone();
  social.name = "Banner - X & LinkedIn (16:9)";
  social.resize(1200, 675);
  social.x = luma.x + 1000 + 120;
  social.y = source.y;

  const socialLeftCard = social.findOne(n => n.name.includes("427319373") || n.name.includes("Frame"));
  const socialEyeBg = social.findOne(n => n.name.includes("4635") || (n.width > 400 && n.x > 300));
  if (socialLeftCard) {
    socialLeftCard.resize(610, 675);
    const gBg = socialLeftCard.findOne(n => n.name.includes("4651") || n.type === "RECTANGLE");
    if (gBg) gBg.resize(610, 675);
    const dBar = socialLeftCard.findOne(n => n.name.includes("4636"));
    if (dBar) {
      dBar.y = 675 - 180;
      dBar.resize(610, 180);
    }
  }
  if (socialEyeBg) {
    socialEyeBg.x = 610;
    socialEyeBg.resize(590, 675);
  }
  createdFrames.push(social);

  // ==========================================
  // 3. 生成 4:5 移动端 / 微信社群海报 (1080 x 1350)
  // ==========================================
  const mobile = source.clone();
  mobile.name = "Mobile - Feed Poster (4:5)";
  mobile.resize(1080, 1350);
  mobile.x = social.x + 1200 + 120;
  mobile.y = source.y;

  const mobileLeftCard = mobile.findOne(n => n.name.includes("427319373") || n.name.includes("Frame"));
  const mobileEyeBg = mobile.findOne(n => n.name.includes("4635") || (n.width > 400 && n.x > 300));
  if (mobileLeftCard) {
    mobileLeftCard.x = 0;
    mobileLeftCard.y = 0;
    mobileLeftCard.resize(1080, 500);
    const gBg = mobileLeftCard.findOne(n => n.name.includes("4651") || n.type === "RECTANGLE");
    if (gBg) gBg.resize(1080, 500);
  }
  if (mobileEyeBg) {
    mobileEyeBg.x = 0;
    mobileEyeBg.y = 500;
    mobileEyeBg.resize(1080, 850);
  }
  createdFrames.push(mobile);

  // 选中并聚焦视图
  figma.currentPage.selection = createdFrames;
  figma.viewport.scrollAndZoomIntoView(createdFrames);

  figma.notify("🎉 成功生成 3 个适配尺寸画板（1:1、16:9、4:5）！");
  figma.closePlugin();
})();
