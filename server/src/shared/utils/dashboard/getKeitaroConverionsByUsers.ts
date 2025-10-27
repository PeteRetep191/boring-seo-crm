export const getKeitaroConversionsReportUsers = async (apiClients: any, dateStart: Date, dateEnd: Date, users: any[]) => {
    
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    const externalIds = users
        .filter(u => !!u.externalId)
        .map(u => u);

    const promises = externalIds.map((user) =>
        apiClients.keitaro.getConversionsReport(
            start.toISOString().split("T")[0],
            end.toISOString().split("T")[0],
            [user.externalId]
        ).then((result: any) => ({
            user: user,
            totals: result.totals
        }))
    );
    
    const results = await Promise.all(promises);

    return results;
}