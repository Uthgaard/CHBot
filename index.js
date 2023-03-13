/////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//  This is a bot which allows players to automatically manage the CH chain       \\
//     with in-game !commands, and then outputs the chain to a discord channel    \\
//     which can then be pasted into game                                         \\
//  There are four commands:                                                      \\
//  !chain start = restarts the chain, clears all assignments                     \\
//  !chain add playername = adds playername to the next position in the chain     \\
//  !chain remove playername = removes playername from the chain                  \\
//     and brings the last person in the chain to their assignment to avoid gaps  \\
//  !chain report = prints the chain assignment to discord                        \\
/////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const { Client, GatewayIntentBits } = require('discord.js')
const fs = require('fs')
const readLastLines = require('read-last-lines')
const content = fs.readFileSync('C:/P99/Logs/eqlog_Uthqaard_P1999Green.txt', 'utf8')
var order = 0
var tempcount = 0
var tempString = ''
var chain = []
var assignment = []
var padding = ''
var index = 0
var lastOne = 0
var poppedCleric = ''

require('dotenv/config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('ready', async () => {
    console.log('The bot is ready')
    /*
    lastLine = "[Mon Mar 13 08:03:18 2023] You say, '!chain add one'"
    console.log(lastLine)
    tempString = lastLine.toUpperCase().trim().split(/[ ']+/g).slice(-2).slice(0,1).toString()
    console.log(tempString)
    chain.push(tempString)
    chain.push(tempString)
    console.log(chain)
    */
    /*
    var testArray = []
    console.log(testArray)
    var testValue = 'TEST'
    testArray.push("TEST")
    testArray.push("ONE")
    testArray.push("TWO")    
    console.log(testArray)
    testArray.forEach((element) =>
        console.log(element)
        )
    console.log(testArray.includes(testValue))
    testArray = []
    console.log(testArray)
    */
    
    //content = await
    //readLastLines.read('C:/P99/Logs/test.txt', 1)
       //.then((lines) => console.log(lines))
    //console.log(resource)
    //console.log(process.cwd())
})


fs.watch('C:/P99/Logs/eqlog_Uthqaard_P1999Green.txt', (eventType, filename) => {
    readLastLines.read('C:/P99/Logs/eqlog_Uthqaard_P1999Green.txt', 1)
     .then((lastLine) => {
        // Restarts the chain, clears all assignments
        if (lastLine.includes('!chain') && lastLine.includes('start')){
            console.log(lastLine.trim())
            console.log('Restarting chain')
            assignment = []
            tempcount = 0
            order = 0
            chain = []
        }
        
        // Adds the cleric to the end of the chain if they are not already in it
        if (lastLine.includes('!chain') && lastLine.includes('add')){
            console.log(lastLine.trim())
            tempString = lastLine.toUpperCase().trim().split(/[ ']+/g).slice(-2).slice(0,1).toString()
            
            if(chain.includes(tempString)){
                //console.log(chain.includes(tempString))
                console.log(tempString + ' is already in chain, cleric not added')
            } else {
                chain.push(tempString)
                //console.log(tempString)
                tempcount = 0
                assignment[tempcount] = order
                console.log(assignment)
                order = order + 1
                tempcount = tempcount + 1
                console.log(chain[assignment])

                if (order < 10){
                    padding = '00'
                } else {
                    padding = '0'
                }

                console.log('Adding ' + chain[assignment] + ' to chain in position: ' + padding + order)
                //client.channels.cache.get('1084116656026034278').send(chain[assignment] + ': ' + padding + order + ' ||')
            }
        }

        // Removes the cleric from chain (if found), and fills the gap
        if (lastLine.includes('!chain') && lastLine.includes('remove')){
            console.log(lastLine.trim())
            tempString = lastLine.toUpperCase().trim().split(/[ ']+/g).slice(-2).slice(0,1).toString()
            console.log(tempString)
            if(chain.includes(tempString)){
                /*
                function checkIndex(tempString){
                    return (chain.includes(tempString))
                }
                */
                index = chain.indexOf(tempString)
                lastOne = (chain.length - 1)
                console.log('Chain goes to ' + (chain.length))
                console.log('Removing ' + tempString + ' from chain position ' + index)
                poppedCleric = chain.pop()
                console.log(poppedCleric + ' removed from chain position ' + lastOne)
                // Moves the last cleric in the chain to the empty spot, AS LONG AS they weren't the cleric being popped off the chain
                if(tempString === poppedCleric){
                } else {
                    chain[index] = poppedCleric
                    console.log('Filling gap - placing ' + poppedCleric + ' in position ' + index)
                }
            }
        }

        // Reports the chain assignment to discord
        if (lastLine.includes('!chain') && lastLine.includes('report')){
            // Try to delete all previous messages in the channel
/*            async () => {
                let fetched;
                do {
                  fetched = await channel.fetchMessages({limit: 100});
                  message.channel.bulkDelete(fetched);
                }
                while(fetched.size >= 2);
            }
*/
            console.log(lastLine.trim())
            index = 0
            client.channels.cache.get('1084895726028468224').send('---- Reporting Current Chain ----')
            chain.forEach((element) => {
                console.log(element)
                //console.log(chain.findIndex())
                console.log(index)
                
                if ((index + 1) < 10){
                    padding = '00'
                } else {
                    padding = '0'
                }
                client.channels.cache.get('1084895726028468224').send(element + ': ' + padding + (index + 1) + ' ||')

                index = index + 1
            })
        }
     })

    //console.log(lines)
    //fs.readFile(content, 'utf-8', (err, data) => {
        //let lines = data.trim().split("\n")
        //console.log(lines[lines.length - 1])
        //client.channels.cache.get('1029397799424512092').send(lines)
    //})
})

/*
client.on('messageCreate', async (message) => {
    if (message.channel.id === "1007149490089758760" && message.content.includes("@everyone")) {
        message.reply('Reply')
    }
})
*/

/* // This just watches the file itself, not the changes inside
fs.watchFile('C:/P99/Logs/eqlog_Uthqaard_P1999Green.txt', (curr, prev) => {

    console.log(curr)
    console.log(prev)

})
*/

client.login(process.env.TOKEN)