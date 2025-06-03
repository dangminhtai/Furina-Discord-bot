const { Client, GatewayIntentBits, Events, EmbedBuilder, REST, Routes, SlashCommandBuilder, ActivityType, PermissionsBitField } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Furina's personality traits and responses in Vietnamese
const furinaResponses = {
    greetings: [
        "Ồ? Một vị khách? Thật thú vị! ✨",
        "Chào mừng đến với Tòa Án Fontaine! 👑",
        "Ah, một người hâm mộ Thủy Thần? 💫",
        "Xin chào, thần dân thân mến của ta! 🌊",
        "Chào mừng đến với vương quốc nước và công lý! ⚖️",
        "Ôi, có người đến thăm đấy à? Ta rất vui! 🎭",
        "Đã lâu rồi mới thấy người lạ ghé qua, thật tuyệt! 🌟",
        "Một ánh mắt mới trong vũ điệu của Fontaine! 💃",
        "Người đến đây để tìm sự thật, phải không? 🔍",
        "Đón chào người đến từ khắp bốn phương năm châu! 🌍",
        "Làn gió mới thổi qua Fontaine, chào mừng người! 🌬️",
        "Ta thấy ánh sáng trong mắt ngươi, thật ấm lòng! 💖",
        "Khách quý đã đến, hãy để Fontaine tỏa sáng cho ngươi! ✨",
        "Sự xuất hiện của ngươi làm không gian này thêm phần huyền ảo! 🌈",
        "Chào người bạn mới của Thủy Thần, xin đừng ngại ngùng! 🤗",
        "Chào đón một linh hồn dũng cảm bước vào Tòa Án! ⚔️",
        "Vị khách này thật may mắn khi được gặp ta đấy! 🍀",
        "Để ta dẫn ngươi vào thế giới huyền bí của Fontaine! 🔮",
        "Từng giọt nước đều chào mừng sự xuất hiện của ngươi! 💧",
        "Một khởi đầu mới đang chờ đợi, ta rất mong gặp gỡ! 🌅"
    ],
    farewells: [
        "Hẹn gặp lại tại Tòa Án Fontaine! 👋",
        "Tạm biệt, khán giả thân mến! 🎭",
        "Buổi biểu diễn phải kết thúc, nhưng ký ức sẽ còn mãi! 💫",
        "Au revoir! (Tạm biệt!) 🎭",
        "Chúc người một hành trình an lành và nhiều cảm hứng! 🌟",
        "Rời đi không phải là kết thúc, hãy trở lại sớm nhé! 💫",
        "Giữ vững niềm tin và hẹn gặp lại trong những ngày tới! ✨",
        "Tạm biệt, để lại dấu ấn của người tại Fontaine! 🌊",
        "Vầng trăng sẽ soi đường, chúc người đi về bình an! 🌙",
        "Chia tay nhưng trái tim vẫn còn gần bên nhau! 💖",
        "Mỗi cuộc gặp đều là duyên số, hẹn ngày tái ngộ! 🍀",
        "Gió biển sẽ đưa lời chào đến tận nơi ngươi đến! 🌬️",
        "Rời đi với niềm vui và ký ức ngọt ngào trong tim! 💝",
        "Chúc ngươi có một chuyến đi tràn đầy năng lượng! ⚡",
        "Tạm biệt, Fontaine luôn mở rộng vòng tay đón chào! 🤗",
        "Dù đi đâu, hãy mang theo ánh sáng của Fontaine! ✨",
        "Hẹn người ngày mai với những điều kỳ diệu mới! 🌅",
        "Sóng nước vẫn lăn tăn, chào đón sự trở lại của ngươi! 🌊",
        "Đừng quên, Fontaine luôn ở đây chờ đợi ngươi! 💫",
        "Chia tay nhưng luôn ghi nhớ từng khoảnh khắc bên nhau! 💖"
    ],
    reactions: [
        "Tuyệt vời làm sao! ✨",
        "Xuất sắc! Thật xuất sắc! 🌟",
        "Ôi trời, thật kịch tính! 🎭",
        "Một màn trình diễn tuyệt vời! 👏",
        "Thật mãn nhãn và đáng nhớ! 💫",
        "Không thể tin được, quá xuất sắc! 😲",
        "Ta phải dành cho màn trình diễn này một tràng pháo tay! 👏",
        "Đúng là nghệ thuật đỉnh cao của Fontaine! 🎨",
        "Từng bước đi đều đầy sức hút và mê hoặc! 💃",
        "Chỉ có thể là tuyệt tác của Thủy Thần mà thôi! 👑",
        "Ta không thể rời mắt khỏi khung cảnh này! 👀",
        "Mỗi chuyển động như một bản nhạc của biển cả! 🎵",
        "Sức mạnh và sự tinh tế hòa quyện hoàn hảo! ⚖️",
        "Ta cảm nhận được tâm hồn của ngươi trong từng chi tiết! 💖",
        "Chính là điều mà Fontaine mong đợi từ ngươi! 🌊",
        "Tỏa sáng rực rỡ như những vì sao trên bầu trời! ⭐",
        "Màn trình diễn làm sống lại dòng chảy của thời gian! ⏳",
        "Sự sáng tạo vượt ngoài mong đợi! 💫",
        "Ngọn lửa nhiệt huyết trong trái tim ngươi thật rực rỡ! 🔥",
        "Đó chính là vẻ đẹp vĩnh hằng của Fontaine! ✨"
    ],
    daily: [
        "Hôm nay ta cảm thấy thật tuyệt vời! ✨",
        "Một ngày mới tại Fontaine, thật đáng mong đợi! 🌅",
        "Ta hy vọng ngày hôm nay sẽ có nhiều điều thú vị! 🎭",
        "Hãy cùng nhau tạo nên một ngày tuyệt vời! 🌟",
        "Năng lượng của biển cả đang tràn ngập trong ta! 🌊",
        "Ngày hôm nay sẽ là chương mới của huyền thoại Fontaine! 📖",
        "Thời tiết êm dịu, trái tim ta cũng êm đềm theo! 💫",
        "Mỗi khoảnh khắc đều quý giá, hãy trân trọng nó! 💖",
        "Ta sẵn sàng đón nhận mọi thử thách trong ngày hôm nay! ⚔️",
        "Dòng nước uốn lượn như nhịp đập của cuộc sống, tuyệt đẹp! 💧",
        "Ánh sáng mặt trời hòa quyện cùng làn nước, tạo nên phép màu! ✨",
        "Sự yên bình trong tâm hồn ta hôm nay thật ngọt ngào! 🍯",
        "Một ngày mới, một cơ hội mới để tỏa sáng! 🌟",
        "Tiếng sóng vỗ nhịp nhàng như bản nhạc của cuộc đời! 🎵",
        "Từng cơn gió mát lành thổi qua, mang theo hy vọng! 🌬️",
        "Ngày hôm nay ta sẽ truyền cảm hứng cho tất cả mọi người! 💫",
        "Sự tĩnh lặng của nước mang đến cho ta sự sáng suốt! 💭",
        "Chào đón những điều bất ngờ và đẹp đẽ sẽ đến! 🎁",
        "Ta cảm nhận được sự hòa hợp tuyệt vời với thiên nhiên! 🌿",
        "Ngày mới bắt đầu, đừng ngại đón nhận những điều mới mẻ! 🌈"
    ]
};
// Danh sách trạng thái của Furina
const furinaStatuses = [
    { text: 'tại Tòa Án Fontaine', type: ActivityType.Playing },
    { text: 'tiếng sóng biển Fontaine', type: ActivityType.Listening },
    { text: 'phiên tòa tại Fontaine', type: ActivityType.Streaming },
    { text: 'công lý của Fontaine', type: ActivityType.Watching },
    { text: 'với những vị khách quý', type: ActivityType.Playing },
    { text: 'những câu chuyện về Fontaine', type: ActivityType.Listening },
    { text: 'vũ điệu của biển cả', type: ActivityType.Watching },
    { text: 'cuộc thi tài tại Fontaine', type: ActivityType.Competing },
    { text: 'những bí mật của Fontaine', type: ActivityType.Watching },
    { text: 'tiếng đàn của Fontaine', type: ActivityType.Listening },
    { text: 'vở kịch mới nhất', type: ActivityType.Streaming },
    { text: 'với những người dân Fontaine', type: ActivityType.Playing },
    { text: 'những câu chuyện thần thoại', type: ActivityType.Listening },
    { text: 'vẻ đẹp của Fontaine', type: ActivityType.Watching },
    { text: 'với những vị thần khác', type: ActivityType.Playing }
];

// Định nghĩa các slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('chao')
        .setDescription('Furina sẽ chào bạn'),
    new SlashCommandBuilder()
        .setName('thongtin')
        .setDescription('Xem thông tin về Furina'),
    new SlashCommandBuilder()
        .setName('noi')
        .setDescription('Furina sẽ nói một câu ngẫu nhiên'),
    new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Furina chia sẻ cảm xúc trong ngày'),
    new SlashCommandBuilder()
        .setName('image')
        .setDescription('Xem một hình ảnh ngẫu nhiên của Furina'),
    new SlashCommandBuilder()
        .setName('about-admin')
        .setDescription('Thông tin về người tạo ra Furina')
        .addSubcommand(sub =>
            sub.setName('basic').setDescription('Thông tin cơ bản về admin'))
        .addSubcommand(sub =>
            sub.setName('contact').setDescription('Thông tin liên hệ admin'))
].map(command => command.toJSON());

// Đăng ký slash commands
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Hàm đăng ký commands
async function registerCommands() {
    try {
        console.log('Bắt đầu đăng ký slash commands...');
        console.log('Commands:', JSON.stringify(commands, null, 2));
        console.log('Client ID:', process.env.CLIENT_ID);
        
        // Đăng ký commands cho tất cả servers
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        
        console.log('Đã đăng ký slash commands thành công!');
        console.log('Đã đăng ký các lệnh:', data.map(cmd => cmd.name).join(', '));
        
        // Kiểm tra từng lệnh đã đăng ký
        data.forEach(cmd => {
            console.log(`Lệnh ${cmd.name}:`, {
                id: cmd.id,
                description: cmd.description,
                options: cmd.options
            });
        });
    } catch (error) {
        console.error('Lỗi khi đăng ký commands:', error);
        console.error('Chi tiết lỗi:', error.message);
        if (error.request) {
            console.error('Request data:', error.request.data);
        }
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`Đã đăng nhập với tên ${client.user.tag}!`);
    console.log('Client ID:', client.user.id);
    
    // Kiểm tra quyền của bot trong server
    const guilds = client.guilds.cache;
    console.log('Số lượng server bot đang ở:', guilds.size);
    
    // Kiểm tra quyền của bot
    try {
        const application = await client.application.fetch();
        console.log('Bot application:', {
            id: application.id,
            name: application.name,
            description: application.description
        });
    } catch (error) {
        console.error('Không thể lấy thông tin application:', error);
    }
    
    guilds.forEach(guild => {
        const botMember = guild.members.cache.get(client.user.id);
        if (botMember) {
            console.log(`Quyền của bot trong server ${guild.name}:`, botMember.permissions.toArray());
        }
    });
    
    // Set random status
    const randomStatus = furinaStatuses[Math.floor(Math.random() * furinaStatuses.length)];
    client.user.setActivity(randomStatus.text, { type: randomStatus.type });
    
    // Đăng ký commands khi bot khởi động
    await registerCommands();
});

// Hàm lấy ảnh từ Wallhaven
async function getRandomWallhavenImage() {
    try {
        console.log('Đang gọi API Wallhaven...');
        const response = await axios.get('https://wallhaven.cc/api/v1/search', {
            params: {
                apikey: process.env.WALLHAVEN_API_KEY,
                q: 'furina genshin',
                categories: '111',
                purity: '100',
                sorting: 'random',
                page: '1'
            }
        });

        console.log('API Wallhaven response status:', response.status);
        if (response.data.data && response.data.data.length > 0) {
            const randomImage = response.data.data[Math.floor(Math.random() * response.data.data.length)];
            console.log('Đã tìm thấy ảnh:', randomImage.path);
            return randomImage.path;
        }
        console.log('Không tìm thấy ảnh nào');
        return null;
    } catch (error) {
        console.error('Lỗi khi lấy ảnh từ Wallhaven:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        return null;
    }
}

// Xử lý slash commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    console.log('Nhận lệnh:', commandName);

    try {
        switch (commandName) {
            case 'chao':
                const greeting = furinaResponses.greetings[Math.floor(Math.random() * furinaResponses.greetings.length)];
                await interaction.reply(greeting);
                break;

            case 'thongtin':
                const infoEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Furina - Thủy Thần')
                    .setDescription('Vị Thủy Thần hiện tại của Fontaine, chủ trì Tòa Án Fontaine.')
                    .addFields(
                        { name: 'Nguyên Tố', value: 'Thủy', inline: true },
                        { name: 'Vũ Khí', value: 'Kiếm', inline: true },
                        { name: 'Vai Trò', value: 'Thủy Thần của Fontaine', inline: true }
                    )
                    .setImage('https://static.wikia.nocookie.net/gensin-impact/images/9/94/Character_Furina_Full_Wish.png/revision/latest/scale-to-width-down/1000?cb=20231108064320')
                    .setTimestamp();
                await interaction.reply({ embeds: [infoEmbed] });
                break;

            case 'noi':
                const quote = furinaResponses.reactions[Math.floor(Math.random() * furinaResponses.reactions.length)];
                await interaction.reply(quote);
                break;

            case 'daily':
                const daily = furinaResponses.daily[Math.floor(Math.random() * furinaResponses.daily.length)];
                await interaction.reply(daily);
                break;

            case 'image':
                try {
                    const wallhavenImage = await getRandomWallhavenImage();
                    if (wallhavenImage) {
                        const imageEmbed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Furina - Thủy Thần')
                            .setImage(wallhavenImage)
                            .setTimestamp();
                        await interaction.reply({ embeds: [imageEmbed] });
                    } else {
                        await interaction.reply("Đang lười, không thể gửi ảnh 😶‍🌫️");
                    }
                } catch (error) {
                    console.error('Lỗi khi xử lý lệnh image:', error);
                    await interaction.reply("Đang lười, không thể gửi ảnh 😶‍🌫️");
                }
                break;

            case 'about-admin':
                if (interaction.options.getSubcommand() === 'basic') {
                    const basicInfoEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Thông Tin Về Admin')
                        .setDescription('Về người tạo ra tôi sao, Tài à? Cậu ấy thật dễ thương!')
                        .addFields(
                            { name: 'Tên', value: 'Tài', inline: true },
                            { name: 'Vai Trò', value: 'Developer', inline: true },
                            { name: 'Sở Thích', value: 'Lập trình, Game, Anime', inline: true }
                        )
                        .setTimestamp();
                    await interaction.reply({ embeds: [basicInfoEmbed] });
                } else if (interaction.options.getSubcommand() === 'contact') {
                    const contactEmbed = new EmbedBuilder()
                        .setColor('#1e90ff')
                        .setTitle('🌊 Thông Tin Liên Hệ Admin')
                        .setDescription('> “Hãy kết nối để cùng nhau tạo nên điều tuyệt vời!”\n\nNếu muốn liên hệ với Tài, bạn có thể dùng các kênh sau:')
                        .addFields(
                            { name: '💬 Discord', value: '`1149477475001323540`', inline: true },
                            { name: '📧 Email', value: '[Dmt826321@gmail.com](mailto:Dmt826321@gmail.com)', inline: true },
                            { name: '🐙 GitHub', value: '[dangminhtai](https://github.com/dangminhtai)', inline: true },
                            { name: '📘 Facebook', value: '[tamidanopro](https://facebook.com/tamidanopro)', inline: true }
                        )
                        .setFooter({ text: 'Furina Bot | Powered by Tài', iconURL: 'https://static.wikia.nocookie.net/gensin-impact/images/1/1c/Character_Furina_Icon.png' })
                        .setTimestamp();
                    await interaction.reply({ embeds: [contactEmbed] });
                }
                break;

            default:
                console.log('Lệnh không được nhận diện:', commandName);
                await interaction.reply("Ồ? Ta không hiểu lệnh này...");
        }
    } catch (error) {
        console.error('Lỗi khi xử lý lệnh:', error);
        await interaction.reply("Có lỗi xảy ra khi xử lý lệnh của ngươi...");
    }
});

// Xử lý khi được mention
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    if (message.mentions.has(client.user)) {
        const response = furinaResponses.greetings[Math.floor(Math.random() * furinaResponses.greetings.length)];
        message.reply(response);
    }
});

// Login to Discord
client.login(process.env.TOKEN);
